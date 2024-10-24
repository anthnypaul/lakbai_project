from fastapi import FastAPI, Depends
from .routes import router
from .database import engine, Base, override_get_db, get_db
from decouple import config

app = FastAPI()


if config("TESTING", cast=bool, default=False):
    from app.database import override_get_db
    app.dependency_overrides[get_db] = override_get_db

# Create database tables
Base.metadata.create_all(bind=engine)

# Include API routes
app.include_router(router)

@app.get("/")
def read_root():
    return {"msg": "Welcome to Lakbai!"}
