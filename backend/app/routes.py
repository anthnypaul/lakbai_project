from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from .google_places_utils import search_country_or_city, search_tourist_attractions
from .yelp_utils import search_yelp
from .openai_utils import generate_dynamic_itinerary
from .models import Itinerary
from .database import SessionLocal
from .schemas import ItinerarySchema, ItineraryRequest
from typing import List

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/search-destination/")
def search_destination(query: str):
    """
    Search for a city or country using Google Places API.
    """
    place = search_country_or_city(query)
    if not place:
        raise HTTPException(status_code=404, detail="Destination not found")
    return {"destination": place}

@router.get("/find-activities/")
def find_activities(lat: float, lng: float):
    """
    Find activities and restaurants using both Google Places and Yelp Fusion APIs.
    """
    attractions = search_tourist_attractions(lat, lng)
    restaurants = search_yelp(lat, lng, "restaurants")

    if not (attractions or restaurants):
        raise HTTPException(status_code=404, detail="No activities found")

    return {"attractions": attractions, "restaurants": restaurants}

@router.post("/generate-itinerary/")
def generate_itinerary_endpoint(request: ItineraryRequest, db: Session = Depends(get_db)):
    """
    Generate a personalized itinerary based on user preferences.
    """
    city, country = request.city, request.country
    days = request.days
    budget = request.budget
    preferred_activities = request.preferred_activities

    # Validate city and retrieve latitude and longitude
    location_data = search_country_or_city(city)
    if not location_data:
        raise HTTPException(status_code=404, detail="City not found")

    lat, lng = location_data['lat'], location_data['lng']

    # Retrieve attractions and restaurants based on location and preferences
    attractions = search_tourist_attractions(lat, lng, preferred_activities)
    restaurants = search_yelp(lat, lng, budget=budget)

    if not (attractions or restaurants):
        raise HTTPException(status_code=404, detail="No activities found")

    try:
        # Call OpenAI to generate the itinerary
        itinerary_text = generate_dynamic_itinerary(
            city, country, days, budget, preferred_activities, attractions, restaurants
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate itinerary: {e}")

    # Save the generated itinerary to the database
    new_itinerary = Itinerary(
        city=city,
        country=country,
        description=itinerary_text,
        duration=days,
        budget=budget,
        preferences=", ".join(preferred_activities)
    )
    db.add(new_itinerary)
    db.commit()

    return {"itinerary": itinerary_text}

@router.get("/itineraries", response_model=List[ItinerarySchema])
def get_itineraries(db: Session = Depends(get_db)):
    """
    Retrieve all saved itineraries from the database.
    """
    itineraries = db.query(Itinerary).all()

    if not itineraries:
        raise HTTPException(status_code=404, detail="No itineraries found")

    # Convert preferences from a comma-separated string to a list
    for itinerary in itineraries:
        itinerary.preferences = itinerary.preferences.split(", ")

    return itineraries

