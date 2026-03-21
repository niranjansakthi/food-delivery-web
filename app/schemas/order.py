# schemas/order.py

from pydantic import BaseModel
from typing import List


class OrderItemCreate(BaseModel):
    menu_item_id: int
    quantity: int


class OrderCreate(BaseModel):
    user_id: int
    restaurant_id: int
    items: List[OrderItemCreate]


class OrderItemResponse(BaseModel):
    menu_item_id: int
    quantity: int

    class Config:
        orm_mode = True


class OrderResponse(BaseModel):
    id: int
    user_id: int
    restaurant_id: int
    items: List[OrderItemResponse]

    class Config:
        orm_mode = True