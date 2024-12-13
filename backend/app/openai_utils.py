from openai import AsyncOpenAI
from decouple import config
import logging
import json
from typing import Dict, List, Tuple, Any
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = AsyncOpenAI()

class PlaceResponse(BaseModel):
    name: str
    description: str
    rating: float
    price_level: int
    area: str = ""  
    notes: str = ""  

class SuggestionsResponse(BaseModel):
    attractions: List[PlaceResponse]
    restaurants: List[PlaceResponse]

async def get_local_suggestions(city: str, country: str, budget: int) -> Tuple[List[Dict], List[Dict]]:
    try:
        prompt = f"""Provide travel recommendations for {city}, {country} with a {budget} budget level.
        Return ONLY a JSON object with exactly this structure:
        {{
            "attractions": [
                {{
                    "name": "string",
                    "description": "string",
                    "rating": float,
                    "price_level": int
                }}
            ],
            "restaurants": [
                {{
                    "name": "string",
                    "description": "string",
                    "rating": float,
                    "price_level": int
                }}
            ]
        }}"""

        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            response_format={"type": "json_object"},
            messages=[
                {
                    "role": "system",
                    "content": "You are a travel expert. Return only valid JSON matching the specified structure."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=1000,
            temperature=0.7
        )
        
        content = response.choices[0].message.content
        parsed_response = SuggestionsResponse.model_validate_json(content)
        return parsed_response.attractions, parsed_response.restaurants

    except Exception as e:
        logger.error(f"Error getting suggestions: {str(e)}")
        raise RuntimeError(f"Failed to get suggestions: {str(e)}")

class ItineraryDay(BaseModel):
    day: int
    weather_consideration: str
    schedule: Dict[str, Dict[str, Any]]

class ItineraryResponse(BaseModel):
    days: List[ItineraryDay]

async def generate_dynamic_itinerary(city, country, days, budget, preferred_activities, attractions, restaurants):
    budget_text = ["$", "$$", "$$$", "$$$$"][budget - 1]
    
    attraction_details = []
    for a in attractions:
        attraction_details.append(
            f"- {a.name} | Area: {a.area} | "
            f"Best time: {'Morning/Afternoon' if a.name.lower().endswith(('garden', 'park', 'shrine', 'museum')) else 'Any'} | "
            f"Price: {'Free' if a.price_level == 0 else budget_text * a.price_level}"
        )
    
    restaurant_details = []
    for r in restaurants:
        restaurant_details.append(
            f"- {r.name} | Area: {r.area} | "
            f"Cuisine: {r.description.split()[0]} | "
            f"Best for: {'Breakfast/Lunch' if 'café' in r.name.lower() else 'Lunch/Dinner'} | "
            f"Price: {budget_text * r.price_level}"
        )

    prompt = f"""Create a {days}-day itinerary for {city}, {country} that matches {', '.join(preferred_activities)}.

Available Venues:
=================
Attractions:
{chr(10).join(attraction_details)}

Restaurants:
{chr(10).join(restaurant_details)}

Return a JSON object with EXACTLY this structure:
{{
  "days": [
    {{
      "day": (integer),
      "weather_consideration": (string with weather note),
      "schedule": {{
        "morning": {{
          "activity": {{
            "name": (attraction name),
            "area": (district/neighborhood),
            "cost": (cost information),
            "notes": (string with tips)
          }},
          "dining": {{
            "name": (restaurant name),
            "area": (district/neighborhood),
            "price_range": (price indicator),
            "cuisine": (cuisine type),
            "notes": (dining tips)
          }}
        }},
        "afternoon": (same structure as morning),
        "evening": (same structure as morning)
      }}
    }}
  ]
}}

Key requirements:
1. Prioritize using provided venues when suitable, but can include other appropriate attractions and restaurants when they better fit the schedule or preferences
2. Every field must exist exactly as shown in the structure
3. All activities must have name, area, cost, and notes
4. When recommending general dining areas instead of specific restaurants, provide helpful area-specific suggestions in the notes
5. Group activities by area within each day to minimize travel
6. Consider venue opening hours and meal times
7. Keep within {budget_text} budget level.
8. Make sure there are no duplicate venues across days
9. Include venues that match: {', '.join(preferred_activities)}

Budget Guidelines:
- Strictly adhere to {budget_text} budget level
- Use consistent price indicators:
  * $ (0-25)
  * $$ (26-50)
  * $$$ (51-100)
  * $$$$ (100+)
- For activities:
  * Use exact costs when available (e.g., "Entry: $15")
  * Use price range for estimates (e.g., "$$-$$$")
- For dining:
  * Use single indicator for casual dining (e.g., "$")
  * Use range for fine dining (e.g., "$$$-$$$$")
- All costs must be within or below specified {budget_text} level
- Free activities should be marked as "Free" or "$" if they require additional purchases
"""

    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You are a travel expert creating logistically efficient and time-appropriate itineraries."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
        max_tokens=2000,
        response_format={"type": "json_object"}
    )
    
    content = response.choices[0].message.content
    itinerary_data = json.loads(content)
    validated_data = ItineraryResponse(**itinerary_data)
    return validated_data.dict()
    