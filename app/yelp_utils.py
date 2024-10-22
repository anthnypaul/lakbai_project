import requests
from decouple import config

YELP_API_KEY = config("YELP_API_KEY")
YELP_BASE_URL = "https://api.yelp.com/v3/businesses/search"

def search_yelp(lat, lng, term="restaurants", radius=2000):
    """
    Search for restaurants and other local businesses using Yelp Fusion API.
    """
    headers = {
        "Authorization": f"Bearer {YELP_API_KEY}"
    }
    params = {
        "latitude": lat,
        "longitude": lng,
        "radius": radius,
        "term": term,
        "limit": 5
    }

    try:
        response = requests.get(YELP_BASE_URL, headers=headers, params=params)

        if response.status_code != 200:
            print(f"Error from Yelp API: {response.text}")
            return []

        data = response.json().get("businesses", [])
        results = [
            {
                "name": business.get("name"),
                "location": business.get("location", {}).get("address1"),
                "rating": business.get("rating"),
                "price": business.get("price", "N/A"),
                "id": business.get("id")
            }
            for business in data
        ]

        return results

    except Exception as e:
        print(f"Error searching Yelp: {e}")
        return []
