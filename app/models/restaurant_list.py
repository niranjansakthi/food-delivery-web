from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Restaurant(Base):
    __tablename__ = 'restaurants'
    id = Column(Integer, primary_key=True,index=True)
    restaurant_name = Column(String)
    location = Column(String)

