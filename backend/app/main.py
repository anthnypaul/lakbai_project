from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import itinerary, users
from .database import engine, Base, override_get_db, get_db
from decouple import config

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if config("TESTING", cast=bool, default=False):
    app.dependency_overrides[get_db] = override_get_db

Base.metadata.create_all(bind=engine)

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(itinerary.router, prefix="/itinerary", tags=["itineraries"])

@app.get("/")
def read_root():
    return {"msg": "Welcome to Lakbai!"}