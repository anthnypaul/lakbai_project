import googlemaps
from decouple import config

# Initialize Google Maps client
GOOGLE_PLACES_API_KEY = config("GOOGLE_PLACES_API_KEY")
gmaps = googlemaps.Client(key=GOOGLE_PLACES_API_KEY)

def search_tourist_attractions(lat, lng, radius=2000):
    """
    Search for tourist attractions using Google Places API.
    """
    if not isinstance(lat, (int, float)) or not isinstance(lng, (int, float)):
        raise ValueError("Invalid latitude or longitude values.")

    try:
        response = gmaps.places_nearby(
            location=(lat, lng),
            radius=min(radius, 50000),  # Cap radius at 50,000 meters
            type="tourist_attraction"
        )

        if response.get('status') != 'OK':
            print(f"Response status: {response.get('status')}")
            return []

        return [
            {
                "name": place.get("name"),
                "location": place.get("vicinity"),
                "rating": place.get("rating"),
                "place_id": place.get("place_id")
            }
            for place in response.get('results', [])
        ]

    except Exception as e:
        print(f"Error searching for attractions: {e}")
        return []

def search_country_or_city(query):
    """
    Search for a country or city using Google Places API.
    """
    try:
        response = gmaps.places(query=query)

        if response.get('status') != 'OK':
            print(f"Response status: {response.get('status')}")
            return None

        place = response.get('results', [])[0]
        return {
            "name": place.get("name"),
            "country": place.get("formatted_address", "").split(",")[-1].strip(),
            "lat": place.get("geometry", {}).get("location", {}).get("lat"),
            "lng": place.get("geometry", {}).get("location", {}).get("lng")
        }

    except Exception as e:
        print(f"Error searching for city or country: {e}")
        return None
