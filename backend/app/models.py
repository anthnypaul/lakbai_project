from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean, DateTime
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from passlib.hash import bcrypt
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    itineraries = relationship("Itinerary", back_populates="user")
    
    def verify_password(self, password: str) -> bool:
        return bcrypt.verify(password, self.hashed_password)
    
    @staticmethod
    def hash_password(password: str) -> str:
        return bcrypt.hash(password)

class Itinerary(Base):
    __tablename__ = "itineraries"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String, nullable=False)
    country = Column(String, nullable=False)
    duration = Column(Integer, nullable=False)
    budget = Column(Integer, nullable=False)
    description = Column(JSON, nullable=False)
    preferences = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="itineraries")