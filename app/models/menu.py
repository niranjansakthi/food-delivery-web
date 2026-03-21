from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Menu(Base):
    __tablename__ = "menu"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, unique=True, index=True)

    items = relationship("MenuItem", back_populates="menu")
    offers = relationship("OfferZone", back_populates="menu")


class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    item_type = Column(String)  # drink / snack / dessert / food

    menu_id = Column(Integer, ForeignKey("menu.id"))

    menu = relationship("Menu", back_populates="items")