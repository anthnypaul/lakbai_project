from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from .openai_utils import generate_dynamic_itinerary, get_local_suggestions
from .models import Itinerary
from .database import SessionLocal
from .schemas import ItinerarySchema, ItineraryRequest
from typing import List, Dict, Any, Tuple
import asyncio

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


suggestions_cache = {}

async def get_cached_suggestions(
    city: str,
    country: str,
    budget: int
) -> Tuple[List[Dict], List[Dict]]:
    cache_key = f"{city}-{country}-{budget}"
    
    if cache_key in suggestions_cache:
        return suggestions_cache[cache_key]
    
    suggestions = await get_local_suggestions(city, country, budget)
    suggestions_cache[cache_key] = suggestions
    return suggestions

@router.post("/generate-itinerary/", response_model=Dict[str, Any])
async def generate_itinerary_endpoint(
    request: ItineraryRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    try:

        attractions, restaurants = await get_cached_suggestions(
            request.city,
            request.country,
            request.budget
        )

        
        itinerary_data = await generate_dynamic_itinerary(
            request.city,
            request.country,
            request.days,
            request.budget,
            request.preferred_activities,
            attractions,
            restaurants
        )

        
        new_itinerary = Itinerary(
            city=request.city,
            country=request.country,
            description=itinerary_data,
            duration=request.days,
            budget=request.budget,
            preferences=", ".join(request.preferred_activities)
        )

        
        try:
            db.add(new_itinerary)
            db.commit()
        except SQLAlchemyError:
            db.rollback()
            pass

        return itinerary_data

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate itinerary: {str(e)}"
        )

@router.get("/itineraries", response_model=List[ItinerarySchema])
async def get_itineraries(db: Session = Depends(get_db)):
    try:
        itineraries = db.query(Itinerary)\
            .order_by(Itinerary.id.desc())\
            .limit(100)\
            .all()
    except SQLAlchemyError:
        raise HTTPException(
            status_code=500,
            detail="Database error when retrieving itineraries"
        )

    if not itineraries:
        raise HTTPException(status_code=404, detail="No itineraries found")

    for itinerary in itineraries:
        itinerary.preferences = itinerary.preferences.split(", ") if itinerary.preferences else []

    return itineraries