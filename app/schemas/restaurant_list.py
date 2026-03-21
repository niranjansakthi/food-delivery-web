from pydantic import BaseModel

class RestaurantCreate(BaseModel):
    restaurant_name: str
    location: str

class RestaurantResponse(BaseModel):
    id: int
    restaurant_name: str
    location: str

    class Config:
        orm_mode = True
