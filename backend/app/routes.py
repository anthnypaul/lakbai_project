from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from .google_places_utils import search_country_or_city
from .openai_utils import generate_dynamic_itinerary, get_local_suggestions
from .models import Itinerary
from .database import SessionLocal
from .schemas import ItinerarySchema, ItineraryRequest
from typing import List, Dict, Any, Optional
from cachetools import cached, TTLCache

router = APIRouter()

cache_location = TTLCache(maxsize=500, ttl=86400)  # 24 hours
cache_suggestions = TTLCache(maxsize=500, ttl=43200)  # 12 hours

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@cached(cache_location)
async def get_cached_location(query: str) -> Optional[Dict]:
    """Get location data with caching"""
    return search_country_or_city(query)

@cached(cache_suggestions)
async def get_cached_suggestions(city: str, country: str, budget: int) -> tuple:
    """Get location-specific suggestions using OpenAI"""
    return await get_local_suggestions(city, country, budget)

async def save_itinerary_to_db(db: Session, itinerary: Itinerary):
    """Background task for database operations"""
    try:
        db.add(itinerary)
        db.commit()
    except SQLAlchemyError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error when saving itinerary")

@router.post("/generate-itinerary/", response_model=Dict[str, Any])
async def generate_itinerary_endpoint(
    request: ItineraryRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Generate a travel itinerary using OpenAI"""
    # Get location data
    location_data = await get_cached_location(request.city)
    if not location_data:
        raise HTTPException(status_code=404, detail="City not found")

    try:
        attractions, restaurants = await get_cached_suggestions(
            request.city,
            request.country,
            request.budget
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get location suggestions: {str(e)}"
        )

    try:
        itinerary_data = await generate_dynamic_itinerary(
            request.city,
            request.country,
            request.days,
            request.budget,
            request.preferred_activities,
            attractions,
            restaurants
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate itinerary: {str(e)}"
        )

    if "days" not in itinerary_data:
        raise HTTPException(
            status_code=500,
            detail="Generated itinerary format is invalid"
        )

    new_itinerary = Itinerary(
        city=request.city,
        country=request.country,
        description=itinerary_data,
        duration=request.days,
        budget=request.budget,
        preferences=", ".join(request.preferred_activities)
    )

    background_tasks.add_task(save_itinerary_to_db, db, new_itinerary)

    return itinerary_data

@router.get("/itineraries", response_model=List[ItinerarySchema])
async def get_itineraries(db: Session = Depends(get_db)):
    """Retrieve all saved itineraries"""
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
        itinerary.preferences = (
            itinerary.preferences.split(", ")
            if itinerary.preferences
            else []
        )

    return itineraries