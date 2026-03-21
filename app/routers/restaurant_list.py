from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.restaurant_list import Restaurant
router = APIRouter(
    prefix="/restaurants",
    tags=["Restaurants"],
)
@router.get("/")
def get_restaurants(db: Session = Depends(get_db)):
    return db.query(Restaurant).all()
