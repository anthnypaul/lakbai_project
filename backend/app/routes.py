from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from .google_places_utils import search_country_or_city, search_tourist_attractions
from .yelp_utils import search_yelp
from .openai_utils import generate_dynamic_itinerary
from .models import Itinerary
from .database import SessionLocal
from .schemas import ItinerarySchema, ItineraryRequest
from typing import List, Dict, Any
from cachetools import cached, TTLCache

router = APIRouter()

cache_location = TTLCache(maxsize=100, ttl=3600)  
cache_activities = TTLCache(maxsize=100, ttl=3600)  

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@cached(cache_location)
def get_cached_location(query: str):
    return search_country_or_city(query)

@cached(cache_activities)
def get_cached_activities(lat: float, lng: float, budget: int):
    attractions = search_tourist_attractions(lat, lng)
    restaurants = search_yelp(lat, lng, budget=budget)
    return attractions, restaurants

@router.get("/search-destination/")
def search_destination(query: str):
    place = get_cached_location(query)
    if not place:
        raise HTTPException(status_code=404, detail="Destination not found")
    return {"destination": place}

@router.get("/find-activities/")
def find_activities(lat: float, lng: float):
    attractions, restaurants = get_cached_activities(lat, lng, budget=None)
    if not (attractions or restaurants):
        raise HTTPException(status_code=404, detail="No activities found")
    return {"attractions": attractions, "restaurants": restaurants}

@router.post("/generate-itinerary/", response_model=Dict[str, Any])
def generate_itinerary_endpoint(request: ItineraryRequest, db: Session = Depends(get_db)):
    location_data = get_cached_location(request.city)
    if not location_data:
        raise HTTPException(status_code=404, detail="City not found")

    lat, lng = location_data['lat'], location_data['lng']
    attractions, restaurants = get_cached_activities(lat, lng, budget=request.budget)

    try:
        itinerary_data = generate_dynamic_itinerary(
            request.city,
            request.country,
            request.days,
            request.budget,
            request.preferred_activities,
            attractions,
            restaurants
        )
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate itinerary: {e}")

    if "days" not in itinerary_data:
        raise HTTPException(status_code=500, detail="Generated itinerary format is invalid")

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
        raise HTTPException(status_code=500, detail="Database error when saving itinerary")

    return itinerary_data

@router.get("/itineraries", response_model=List[ItinerarySchema])
def get_itineraries(db: Session = Depends(get_db)):
    try:
        itineraries = db.query(Itinerary).all()
    except SQLAlchemyError:
        raise HTTPException(status_code=500, detail="Database error when retrieving itineraries")

    if not itineraries:
        raise HTTPException(status_code=404, detail="No itineraries found")

    for itinerary in itineraries:
        itinerary.preferences = itinerary.preferences.split(", ") if itinerary.preferences else []

    return itineraries
