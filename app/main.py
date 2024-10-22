from fastapi import FastAPI
from .routes import router
from .database import engine, Base

app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# Include API routes
app.include_router(router)

@app.get("/")
def read_root():
    return {"msg": "Welcome to Lakbai!"}
