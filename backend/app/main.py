from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import itinerary, users
from .database import engine, Base, override_get_db, get_db
from decouple import config
import logging

# Configure logging
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up database cleanup on shutdown
# @app.on_event("shutdown")
# async def shutdown_event():
#     if config("ENV", default="development") == "development":
#         try:
#             logger.info("Dropping all tables...")
#             Base.metadata.drop_all(bind=engine)
#             logger.info("Successfully dropped all tables")
#         except Exception as e:
#             logger.error(f"Error dropping tables: {str(e)}")

# Testing override
if config("TESTING", cast=bool, default=False):
    app.dependency_overrides[get_db] = override_get_db

# Create tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(itinerary.router, prefix="/itinerary", tags=["itineraries"])

@app.get("/")
def read_root():
    return {"msg": "Welcome to Lakbai!"}