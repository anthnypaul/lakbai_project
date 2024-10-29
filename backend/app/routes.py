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
    location_data = search_country_or_city(request.city)
    if not location_data:
        raise HTTPException(status_code=404, detail="City not found")

    lat, lng = location_data['lat'], location_data['lng']

    # Retrieve attractions and restaurants based on location and preferences
    attractions = search_tourist_attractions(lat, lng, request.preferred_activities)
    restaurants = search_yelp(lat, lng, budget=request.budget)

    # Retry with broader search radius if insufficient activities are found
    if len(attractions) < request.days:
        attractions = search_tourist_attractions(lat, lng, radius=10000)

    # Add default attractions or reduce days if still insufficient
    if len(attractions) < request.days:
        default_attractions = [
            {"name": "Central Park", "location": "New York, NY", "rating": 4.7, "place_id": "default_1"},
            {"name": "Art Museum", "location": "New York, NY", "rating": 4.5, "place_id": "default_2"}
        ]
        attractions.extend(default_attractions[:request.days - len(attractions)])

    if len(attractions) < request.days or len(restaurants) < request.days:
        request.days = min(len(attractions), len(restaurants))
        if request.days == 0:
            raise HTTPException(status_code=404, detail="Not enough activities found to generate even a partial itinerary.")

    try:
        # Call OpenAI to generate the itinerary
        itinerary_text = generate_dynamic_itinerary(
            request.city, request.country, request.days, request.budget, request.preferred_activities, attractions, restaurants
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate itinerary: {e}")

    # Save the generated itinerary to the database
    new_itinerary = Itinerary(
        city=request.city,
        country=request.country,
        description=itinerary_text,
        duration=request.days,
        budget=request.budget,
        preferences=", ".join(request.preferred_activities)
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
