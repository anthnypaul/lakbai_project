from openai import AsyncOpenAI
from decouple import config
import json
from typing import Dict, List, Tuple, Any

client = AsyncOpenAI(api_key=config("OPENAI_API_KEY"))

async def get_local_suggestions(city: str, country: str, budget: int) -> Tuple[List[Dict], List[Dict]]:
    budget_text = ["$", "$$", "$$$", "$$$$"][budget - 1]
    
    prompt = (
        f"Generate popular tourist attractions and local restaurants in {city}, {country}. "
        f"Budget level: {budget_text}. "
        "Format the response as JSON with this exact structure:\n"
        '{\n'
        '    "attractions": [\n'
        '        {"name": "Attraction Name", "description": "Brief description", "rating": 4.5, "price_level": 2},\n'
        '        ... (10 attractions)\n'
        '    ],\n'
        '    "restaurants": [\n'
        '        {"name": "Restaurant Name", "cuisine": "Cuisine type", "rating": 4.3, "price_level": 2},\n'
        '        ... (10 restaurants)\n'
        '    ]\n'
        '}\n\n'
        "Include realistic ratings (1-5) and price levels (1-4). "
        "Ensure suggestions match the specified budget level. "
        "Mix famous and lesser-known local spots."
    )

    try:
        response = await client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a local expert providing travel recommendations."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        content = response.choices[0].message.content.strip()
        suggestions = json.loads(content)
        
        attractions = [
            {
                "name": attr.get("name", ""),
                "description": attr.get("description", "Popular local attraction"),
                "rating": float(attr.get("rating", 4.0)),
                "price_level": int(attr.get("price_level", budget))
            }
            for attr in suggestions.get("attractions", [])
        ]
        
        restaurants = [
            {
                "name": rest.get("name", ""),
                "cuisine": rest.get("cuisine", "Local cuisine"),
                "rating": float(rest.get("rating", 4.0)),
                "price_level": int(rest.get("price_level", budget))
            }
            for rest in suggestions.get("restaurants", [])
        ]
        
        return attractions, restaurants

    except Exception as e:
        return (
            [{"name": f"Popular Attraction {i}", "rating": 4.0, "price_level": budget} for i in range(5)],
            [{"name": f"Local Restaurant {i}", "rating": 4.0, "price_level": budget} for i in range(5)]
        )

async def generate_dynamic_itinerary(city: str, country: str, days: int, budget: int, preferred_activities: List[str], attractions: List[Dict], restaurants: List[Dict]) -> Dict[str, Any]:
    budget_text = ["$", "$$", "$$$", "$$$$"][budget - 1]
    
    # Create more detailed context from attractions and restaurants
    attractions_text = "\nSuggested Attractions:"
    for a in attractions[:5]:
        name = a.get('name', '')
        desc = a.get('description', '')
        attractions_text += f"\n- {name}: {desc}"
    
    restaurants_text = "\nRecommended Restaurants:"
    for r in restaurants[:5]:
        name = r.get('name', '')
        cuisine = r.get('cuisine', '')
        restaurants_text += f"\n- {name} ({cuisine})"

    interests = ", ".join(preferred_activities) if preferred_activities else "general sightseeing"
    
    prompt = (
        f"Create a {days}-day itinerary for {city}, {country}.\n\n"
        f"Budget: {budget_text}\nInterests: {interests}\n"
        f"{attractions_text}\n{restaurants_text}\n\n"
        "Important:\n"
        f"1. Use actual attractions and restaurants from {city}\n"
        "2. Include neighborhood/district names in parentheses\n"
        "3. Match restaurant suggestions to the activity locations\n"
        "4. Consider timing (breakfast/brunch spots for morning, etc.)\n"
        "5. Follow budget level for dining choices\n\n"
        "Example response format for ONE timeslot:\n"
        '{\n'
        '  "morning": {\n'
        '    "activity": "Pike Place Market (Downtown)",\n'
        '    "dining": "Biscuit Bitch (Downtown)"\n'
        '  }\n'
        '}\n\n'
        'Complete itinerary format:\n'
        '{"days": [{"day": 1, "schedule": {\n'
        '    "morning": {"activity": "...", "dining": "..."},\n'
        '    "afternoon": {"activity": "...", "dining": "..."},\n'
        '    "evening": {"activity": "...", "dining": "..."}\n'
        '}}]}'
    )

    try:
        response = await client.chat.completions.create(
            model="gpt-4-turbo",  # Using larger context model
            messages=[
                {
                    "role": "system", 
                    "content": f"You are a local expert providing specific recommendations in {city}."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=2000,
            temperature=0.8,  # Slightly higher for more specific suggestions
            presence_penalty=0.3,  # Encourage variety
            frequency_penalty=0.3
        )
        
        content = response.choices[0].message.content.strip()
        itinerary_data = json.loads(content)

        # Validation with fixes instead of rejections
        if "days" not in itinerary_data:
            raise ValueError("Missing days in response")

        # Track used venues to avoid duplicates
        used_venues = set()

        for day in itinerary_data["days"]:
            schedule = day.get("schedule", {})
            for slot in ["morning", "afternoon", "evening"]:
                slot_data = schedule.get(slot, {})
                
                activity = slot_data.get("activity", "")
                dining = slot_data.get("dining", "")

                # Verify and fix format if needed
                if not "(" in activity or not ")" in activity:
                    activity += f" ({city} Center)"
                if isinstance(dining, str):
                    if not "(" in dining or not ")" in dining:
                        dining += f" ({city} Center)"
                    # Track for duplicates
                    used_venues.add(dining.split("(")[0].strip().lower())
                elif isinstance(dining, list):
                    for dining_item in dining:
                        if not "(" in dining_item or not ")" in dining_item:
                            dining_item += f" ({city} Center)"
                        # Track for duplicates
                        used_venues.add(dining_item.split("(")[0].strip().lower())
                    # Join the list back into a string if needed
                    dining = ", ".join(dining)

                # Update the data
                slot_data["activity"] = activity
                slot_data["dining"] = dining

                # Track for duplicates
                used_venues.add(activity.split("(")[0].strip().lower())

        return itinerary_data

    except Exception as e:
        raise RuntimeError(f"Failed to generate itinerary: {str(e)}")