from fastapi import FastAPI
from app.models.user import User
from app.database import Base,engine,SessionLocal
from app.models import menu,offerzone,restaurant_list,user
from app.routers import menu as menu_router, offerzone as offerzone_router, restaurant_list as restaurant_router, user as user_router
from app.routers import orders



from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)
app.include_router(orders.router)

app.include_router(menu_router.router)
app.include_router(offerzone_router.router)
app.include_router(restaurant_router.router)
app.include_router(user_router.router)

@app.get("/")
def root():
    return {"message": "API running"}