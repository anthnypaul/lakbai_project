from sqlalchemy.orm import Session
from .models import Destination, Activity

def get_all_destinations(db: Session):
    return db.query(Destination).all()

def create_destination(db: Session, destination_data: dict):
    new_destination = Destination(**destination_data)
    db.add(new_destination)
    db.commit()
    db.refresh(new_destination)
    return new_destination
