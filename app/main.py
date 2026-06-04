from fastapi import FastAPI

from app.routes.room_routes import router as room_router
from app.routes.customer_routes import router as customer_router
from app.routes.booking_routes import router as booking_router

app = FastAPI()

@app.get("/")
def home():
    return {
        "message": "Welcome to Hotel Management System"
    }

app.include_router(room_router)
app.include_router(customer_router)
app.include_router(booking_router)