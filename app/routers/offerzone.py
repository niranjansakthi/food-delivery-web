from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.offerzone import OfferZone

router = APIRouter(
    prefix="/offers",
    tags=["Offers"],
)
@router.get("/")
def get_offers(db:Session = Depends(get_db)):
    return db.query(OfferZone).all()