from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import router
from .database import engine, Base, override_get_db, get_db
from decouple import config

app = FastAPI()

# Enable CORS to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your frontend origin if different
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Check if TESTING environment variable is set to true
if config("TESTING", cast=bool, default=False):
    # Override the database dependency with a test database setup if testing
    app.dependency_overrides[get_db] = override_get_db

# Create database tables
Base.metadata.create_all(bind=engine)

# Include API routes
app.include_router(router)

@app.get("/")
def read_root():
    return {"msg": "Welcome to Lakbai!"}
