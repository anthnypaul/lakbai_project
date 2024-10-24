from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base
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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# In-memory data base testing 
test_database_url = "sqlite+aiosqlite:///:memory:" 
test_engine = create_engine(test_database_url, connect_args={"check_same_thread": False})
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
test_database = Database(test_database_url)

def override_get_db():
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()
