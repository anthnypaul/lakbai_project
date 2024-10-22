import openai
from decouple import config
from fastapi import HTTPException

# Set OpenAI API key
openai.api_key = config("OPENAI_API_KEY")

def generate_itinerary(city, country, attractions, restaurants):
    """
    Generate a detailed itinerary using OpenAI's ChatCompletion endpoint.
    """
    if len(attractions) < 3 or len(restaurants) < 3:
        raise ValueError("Not enough attractions or restaurants for a 3-day itinerary.")

    # Prepare the messages for OpenAI
    attraction_names = [a["name"] for a in attractions]
    restaurant_names = [r["name"] for r in restaurants]
    messages = [
        {"role": "system", "content": "You are a helpful travel assistant."},
        {"role": "user", "content": (
            f"Create a 3-day travel itinerary for {city}, {country}.\n"
            f"Day 1: Visit {attraction_names[0]}, have lunch at {restaurant_names[0]}.\n"
            f"Day 2: Explore {attraction_names[1]}, dine at {restaurant_names[1]}.\n"
            f"Day 3: Go to {attraction_names[2]}, enjoy dinner at {restaurant_names[2]}.\n"
            "Make it fun, detailed, and suitable for tourists."
        )}
    ]

    try:
        # Use the ChatCompletion API with gpt-3.5-turbo
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=300,
            temperature=0.7
        )
        itinerary_text = response.choices[0].message['content'].strip()
        print("OpenAI Response:", itinerary_text)
        return itinerary_text

    except Exception as e:
        print(f"Error while generating itinerary: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate itinerary: {e}")
