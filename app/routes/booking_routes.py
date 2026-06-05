from fastapi import APIRouter
from app.schemas.booking_schema import BookingCreate
from app.models.booking import Booking
from app.database.db import SessionLocal

router = APIRouter()


@router.get("/bookings")
def get_bookings():
    db = SessionLocal()

    bookings = db.query(Booking).order_by(Booking.booking_id).all()

    result = []

    for booking in bookings:
        result.append(
            {
                "booking_id": booking.booking_id,
                "customer_id": booking.customer_id,
                "room_id": booking.room_id,
                "check_in": booking.check_in,
                "check_out": booking.check_out,
                "booking_status": booking.booking_status
            }
        )

    db.close()

    return result


@router.post("/bookings")
def create_booking(booking: BookingCreate):
    db = SessionLocal()

    new_booking = Booking(
        customer_id=booking.customer_id,
        room_id=booking.room_id,
        check_in=booking.check_in,
        check_out=booking.check_out,
        booking_status=booking.booking_status
    )

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    db.close()

    return {
        "message": "Booking Created Successfully",
        "booking_id": new_booking.booking_id
    }


@router.put("/bookings/{booking_id}")
def update_booking(booking_id: int, booking: BookingCreate):
    db = SessionLocal()

    existing_booking = db.query(Booking).filter(
        Booking.booking_id == booking_id
    ).first()

    if not existing_booking:
        db.close()
        return {"message": "Booking Not Found"}

    existing_booking.customer_id = booking.customer_id
    existing_booking.room_id = booking.room_id
    existing_booking.check_in = booking.check_in
    existing_booking.check_out = booking.check_out
    existing_booking.booking_status = booking.booking_status

    db.commit()

    db.close()

    return {
        "message": f"Booking {booking_id} Updated Successfully"
    }


@router.delete("/bookings/{booking_id}")
def delete_booking(booking_id: int):
    db = SessionLocal()

    booking = db.query(Booking).filter(
        Booking.booking_id == booking_id
    ).first()

    if not booking:
        db.close()
        return {"message": "Booking Not Found"}

    db.delete(booking)
    db.commit()

    db.close()

    return {
        "message": f"Booking {booking_id} Deleted Successfully"
    }