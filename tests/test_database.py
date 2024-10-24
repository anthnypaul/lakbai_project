import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, override_get_db
from app.main import app
from fastapi.testclient import TestClient

SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"
test_engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_test_db():
    try:
        db = TestSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[override_get_db] = override_test_db

@pytest.fixture(scope="module")
def test_db():
    Base.metadata.create_all(bind=test_engine)
    yield TestSessionLocal()
    Base.metadata.drop_all(bind=test_engine)

@pytest.fixture(scope="module")
def client(test_db):
    return TestClient(app)

def test_create_record(client):
    payload = {
        "city": "Los Angeles",
        "country": "USA",
        "days": 3,
        "budget": 2,
        "preferred_activities": ["museum", "restaurant"]
    }
    response = client.post("/generate-itinerary/", json=payload)
    assert response.status_code == 200
    assert "itinerary" in response.json()

def test_read_records(client):
    response = client.get("/itineraries")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
