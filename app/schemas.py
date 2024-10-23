from pydantic import BaseModel, Field
from typing import List

class ItineraryRequest(BaseModel):
    city: str = Field(..., description="The city for the itinerary")
    country: str = Field(..., description="The country for the itinerary")
    days: int = Field(..., description="Trip duration in days (e.g., 1, 3, 5, 7)")
    budget: int = Field(..., ge=1, le=4, description="Budget level (1 to 4, where 1 is least expensive and 4 is most)")
    preferred_activities: List[str] = Field(..., description="List of preferred activities")

class ItinerarySchema(BaseModel):
    id: int
    city: str
    country: str
    duration: int
    budget: int
    preferences: List[str]  
    description: str

    class Config:
       from_attributes = True
