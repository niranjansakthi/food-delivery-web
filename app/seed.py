from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.menu import Menu, MenuItem
from app.models.restaurant_list import Restaurant
from app.models.offerzone import OfferZone


db: Session = SessionLocal()


def seed_restaurants():
    restaurants = [
        {"restaurant_name": "Coffee Haven", "location": "Downtown"},
        {"restaurant_name": "Urban Brew Cafe", "location": "Tech Park"},
        {"restaurant_name": "Midnight Beans", "location": "City Center"},
        {"restaurant_name": "Roasted Aroma", "location": "Market Street"},
        {"restaurant_name": "Cafe Mocha Bliss", "location": "Mall Road"},
        {"restaurant_name": "Golden Bean Cafe", "location": "Airport Road"},
        {"restaurant_name": "Caffeine Station", "location": "Central Avenue"},
        {"restaurant_name": "Morning Roast", "location": "University Area"},
    ]

    for r in restaurants:
        db.add(Restaurant(**r))

    db.commit()


def seed_menus():
    menus = [
        {"id": 1, "category": "Drinks"},
        {"id": 2, "category": "Snacks"},
        {"id": 3, "category": "Desserts"},
        {"id": 4, "category": "Foods"},
    ]
    for m in menus:
        if not db.query(Menu).filter(Menu.id == m["id"]).first():
            db.add(Menu(**m))
    db.commit()


def seed_drinks():

    drinks = [
        {"name": "Cold Coffee", "menu_id": 1},
        {"name": "Cappuccino", "menu_id": 1},
        {"name": "Espresso", "menu_id": 1},
        {"name": "Iced Latte", "menu_id": 1},
        {"name": "Chocolate Milkshake", "menu_id": 1},
        {"name": "Oreo Milkshake", "menu_id": 1},
    ]

    for d in drinks:
        db.add(MenuItem(**d, item_type="drink"))

    db.commit()


def seed_snacks():

    snacks = [
        {"name": "French Fries", "menu_id": 2},
        {"name": "Garlic Bread", "menu_id": 2},
        {"name": "Veg Sandwich", "menu_id": 2},
        {"name": "Chicken Sandwich", "menu_id": 2},
        {"name": "Nachos", "menu_id": 2},
    ]

    for s in snacks:
        db.add(MenuItem(**s, item_type="snack"))

    db.commit()


def seed_desserts():

    desserts = [
        {"name": "Chocolate Brownie", "menu_id": 3},
        {"name": "Chocolate Lava Cake", "menu_id": 3},
        {"name": "Vanilla Ice Cream", "menu_id": 3},
        {"name": "Strawberry Cheesecake", "menu_id": 3},
    ]

    for d in desserts:
        db.add(MenuItem(**d, item_type="dessert"))

    db.commit()


def seed_foods():

    foods = [
        {"name": "Veg Burger", "menu_id": 4},
        {"name": "Chicken Burger", "menu_id": 4},
        {"name": "Margherita Pizza", "menu_id": 4},
        {"name": "Pasta Alfredo", "menu_id": 4},
    ]

    for f in foods:
        db.add(MenuItem(**f, item_type="food"))

    db.commit()


def seed_offers():

    offers = [
        {"title": "Cold Coffee Deal", "discount": 20, "menu_item_id": 1},
        {"title": "Milkshake Madness", "discount": 15, "menu_item_id": 1},
        {"title": "Snack Combo", "discount": 10, "menu_item_id": 2},
    ]

    for o in offers:
        db.add(OfferZone(**o))

    db.commit()


def run_seed():

    seed_restaurants()
    seed_menus()
    seed_drinks()
    seed_snacks()
    seed_desserts()
    seed_foods()
    seed_offers()

    print("Database seeded successfully")


if __name__ == "__main__":
    run_seed()