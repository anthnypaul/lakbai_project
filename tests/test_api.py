import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_get_itineraries():
    async with AsyncClient(transport=ASGITransport(app), base_url="http://test") as ac:
        response = await ac.get("/itineraries")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_generate_itinerary():
    payload = {
        "city": "Los Angeles",
        "country": "USA",
        "days": 3,
        "budget": 2,
        "preferred_activities": ["hiking", "museum", "restaurant"]
    }
    async with AsyncClient(transport=ASGITransport(app), base_url="http://test") as ac:
        response = await ac.post("/generate-itinerary/", json=payload)
    assert response.status_code == 200
    assert "itinerary" in response.json()

@pytest.mark.asyncio
async def test_search_destination():
    async with AsyncClient(transport=ASGITransport(app), base_url="http://test") as ac:
        response = await ac.get("/search-destination/?query=Los Angeles")
    assert response.status_code == 200
    assert "destination" in response.json()

@pytest.mark.asyncio
async def test_find_activities():
    lat, lng = 34.0522, -118.2437  # coordinates for LA
    async with AsyncClient(transport=ASGITransport(app), base_url="http://test") as ac:
        response = await ac.get(f"/find-activities/?lat={lat}&lng={lng}")
    assert response.status_code == 200
    assert "attractions" in response.json()
    assert "restaurants" in response.json()
