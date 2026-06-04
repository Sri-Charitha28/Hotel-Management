from fastapi import APIRouter
from app.schemas.booking_schema import BookingCreate

router = APIRouter()


@router.get("/bookings")
def get_bookings():
    return {"message": "All Bookings"}


@router.post("/bookings")
def create_booking(booking: BookingCreate):
    return {
        "message": "Booking Created Successfully",
        "data": booking
    }


@router.put("/bookings/{booking_id}")
def update_booking(booking_id: int, booking: BookingCreate):
    return {
        "message": f"Booking {booking_id} Updated Successfully",
        "data": booking
    }


@router.delete("/bookings/{booking_id}")
def delete_booking(booking_id: int):
    return {
        "message": f"Booking {booking_id} Deleted Successfully"
    }