from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from databases import Database
from decouple import config

# Load environment variables
DATABASE_URL = config('DATABASE_URL')

# SQLAlchemy database connection
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Async database connection for FastAPI
database = Database(DATABASE_URL)
