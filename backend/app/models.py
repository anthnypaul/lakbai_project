from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSON
from .database import Base

class Itinerary(Base):
    __tablename__ = "itineraries"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String, nullable=False)
    country = Column(String, nullable=False)
    duration = Column(Integer, nullable=False)
    budget = Column(Integer, nullable=False)
    description = Column(JSON, nullable=False)
    preferences = Column(Text, nullable=True)  
