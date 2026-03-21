from pydantic import BaseModel


class OfferCreate(BaseModel):
    title: str
    discount: int
    menu_item_id: int


class OfferResponse(BaseModel):
    id: int
    title: str
    discount: int
    menu_item_id: int

    class Config:
        orm_mode = True