from pydantic import BaseModel
from typing import List

class MenuItemResponse(BaseModel):
    id: int
    name: str
    item_type: str

    class Config:
        from_attributes = True

class MenuResponse(BaseModel):
    id: int
    category: str
    items: List[MenuItemResponse] = []

    class Config:
        from_attributes = True