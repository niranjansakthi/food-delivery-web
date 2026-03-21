from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/register",response_model=UserResponse)
def Create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    new_user = User(
        username=user.username,
        email=user.email,
        password=user.password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login",response_model=UserResponse)
def login(user_credentials:UserLogin , db:Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_credentials.email).first()

    if not user or user.password != user_credentials.password:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    return user

