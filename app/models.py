from sqlalchemy import Column, Integer, String, Text
from .database import Base

class Itinerary(Base):
    __tablename__ = "itineraries"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String, nullable=False)
    country = Column(String, nullable=False)
    description = Column(Text, nullable=False)

