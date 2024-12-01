import openai
from decouple import config
import json

openai.api_key = config("OPENAI_API_KEY")

def generate_dynamic_itinerary(city, country, days, budget, preferred_activities, attractions, restaurants):
    """
    Generates a structured travel itinerary in JSON format using OpenAI's API.
    """
   
    budget_text = ["$", "$$", "$$$", "$$$$"][budget - 1]

    
    prompt = (
        f"Generate a {days}-day travel itinerary for {city}, {country}. Each day should contain activities and dining options for morning, "
        f"afternoon, and evening time slots. For each time slot, include both an 'activity' and a 'dining' field with descriptions.\n\n"
        f"Use this JSON structure exactly:\n"
        "{\n"
        "    'days': [\n"
        "        {\n"
        "            'day': 1,\n"
        "            'schedule': {\n"
        "                'morning': {'activity': '...', 'dining': '...'},\n"
        "                'afternoon': {'activity': '...', 'dining': '...'},\n"
        "                'evening': {'activity': '...', 'dining': '...'}\n"
        "            }\n"
        "        },\n"
        "        ... (continue for each day)\n"
        "    ]\n"
        "}\n\n"
        "Ensure the JSON format is followed precisely without any missing fields, even if some activities or dining options need placeholders."
    )

    messages = [
        {"role": "system", "content": "You are a travel assistant that generates itineraries in JSON format."},
        {"role": "user", "content": prompt}
    ]

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            max_tokens=1500,  
            temperature=0.3
        )
        content = response.choices[0].message["content"].strip()

        
        itinerary_data = json.loads(content)

        
        for day in itinerary_data["days"]:
            for time_slot in ["morning", "afternoon", "evening"]:
                if time_slot not in day["schedule"]:
                    raise ValueError(f"Missing {time_slot} field in day {day['day']}")
                if "activity" not in day["schedule"][time_slot] or "dining" not in day["schedule"][time_slot]:
                    raise ValueError(f"Missing activity or dining in {time_slot} of day {day['day']}")

        return itinerary_data

    except (openai.error.OpenAIError, json.JSONDecodeError, ValueError) as e:
        raise RuntimeError(f"Error generating itinerary: {e}")
