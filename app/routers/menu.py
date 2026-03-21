from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session, joinedload
from typing import List

from app.database import get_db
from app.models.menu import Menu
from app.schemas.menu import MenuResponse

router = APIRouter( prefix="/menu",tags=["Menu"])

@router.get("/", response_model=List[MenuResponse])
def get_my_menu(db:Session = Depends(get_db)):
    return db.query(Menu).options(joinedload(Menu.items)).all()