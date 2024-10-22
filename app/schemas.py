from pydantic import BaseModel

class ItinerarySchema(BaseModel):
    id: int
    city: str
    country: str
    description: str

    class Config:
        orm_mode = True
