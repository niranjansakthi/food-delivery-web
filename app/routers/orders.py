from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.orders import Order, OrderItem
from app.schemas.order import OrderCreate, OrderResponse


router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)
@router.post("/", response_model=OrderResponse)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    new_order = Order(user_id=order.user_id, restaurant_id=order.restaurant_id)

    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    for item in order.items:
        order_item = OrderItem(
            order_id=new_order.id,
            menu_item_id=item.menu_item_id,
            quantity=item.quantity,
        )
        db.add(order_item)
    db.commit()
    db.refresh(new_order)
    return new_order

@router.get("/user/{user_id}", response_model=list[OrderResponse])
def get_user_orders(user_id: int, db: Session = Depends(get_db)):

    orders = db.query(Order).filter(Order.user_id == user_id).all()
    return orders