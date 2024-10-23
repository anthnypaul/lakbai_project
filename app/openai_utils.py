import openai
from decouple import config

# Set OpenAI API key
openai.api_key = config("OPENAI_API_KEY")

def generate_dynamic_itinerary(city, country, days, budget, preferred_activities, attractions, restaurants):
    max_tokens = 300 + (days - 1) * 100

    messages = [
        {"role": "system", "content": "You are a helpful travel assistant."},
        {
            "role": "user",
            "content": (
                "Create a {days}-day travel itinerary for {city}, {country}.\n"
                "Include activities based on the following preferences:\n"
                "Preferred Activities: {activities}\n"
                "Budget: {budget} USD\n"
                "Attractions: {attractions}\n"
                "Restaurants: {restaurants}\n"
                "Make the itinerary detailed, engaging, and suitable for tourists."
            ).format(
                days=days,
                city=city,
                country=country,
                activities=", ".join(preferred_activities),
                budget=budget,
                attractions=", ".join([attraction['name'] for attraction in attractions]),
                restaurants=", ".join([restaurant['name'] for restaurant in restaurants])
            ),
        },
    ]

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=max_tokens,
            temperature=0.7
        )
        itinerary_text = response.choices[0].message['content'].strip()
        return itinerary_text
    except Exception as e:
        raise RuntimeError(f"Error generating itinerary: {e}")
