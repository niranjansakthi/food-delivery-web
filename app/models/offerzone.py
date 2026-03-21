from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.menu import Menu

class OfferZone(Base):
    __tablename__ = "offers"
    id = Column(Integer, primary_key=True)
    title = Column(String)
    discount = Column(Integer)

    menu_item_id = Column(Integer, ForeignKey("menu.id"))

    menu = relationship("Menu", back_populates="offers")