from fastapi import APIRouter
from app.schemas.booking_schema import BookingCreate
from app.models.booking import Booking
from app.database.db import SessionLocal
from app.models.room import Room
from fastapi import APIRouter, HTTPException
from sqlalchemy import and_, or_
from app.models.customers import Customer

router = APIRouter()


@router.get("/bookings")
def get_bookings():

    db = SessionLocal()

    bookings = db.query(Booking).order_by(
        Booking.booking_id
    ).all()

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

    # Check-Out must be after Check-In
    if booking.check_out <= booking.check_in:

        db.close()

        raise HTTPException(
            status_code=400,
            detail="Check-out date must be after Check-in date"
        )

    # Check if room already booked for selected dates
    existing_booking = db.query(Booking).filter(
        Booking.room_id == booking.room_id,
        Booking.check_in < booking.check_out,
        Booking.check_out > booking.check_in
    ).first()

    if existing_booking:

        db.close()

        raise HTTPException(
            status_code=400,
            detail="Room already booked for selected dates"
        )

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

    room = db.query(Room).filter(
        Room.room_id == booking.room_id
    ).first()

    if room:
        room.status = "occupied"
        db.commit()

    booking_id = new_booking.booking_id

    db.close()

    return {
        "message": "Booking Created Successfully",
        "booking_id": booking_id
    }
@router.put("/bookings/{booking_id}")
def update_booking(
    booking_id: int,
    booking: BookingCreate
):

    db = SessionLocal()

    existing_booking = db.query(Booking).filter(
        Booking.booking_id == booking_id
    ).first()

    if not existing_booking:

        db.close()

        return {
            "message": "Booking Not Found"
        }

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

        return {
            "message": "Booking Not Found"
        }

    booking.booking_status = "cancelled"

    db.commit()

    db.close()

    return {
        "message": "Booking Cancelled Successfully"
    }
@router.get("/my-bookings/{customer_id}")
def get_my_bookings(customer_id: int):

    db = SessionLocal()

    bookings = db.query(
        Booking,
        Room
    ).join(
        Room,
        Booking.room_id == Room.room_id
    ).filter(
        Booking.customer_id == customer_id
    ).all()

    result = []

    for booking, room in bookings:

        result.append(
            {
                "booking_id": booking.booking_id,
                "room_number": room.room_number,
                "room_type": room.room_type,
                "price": float(room.price),
                "check_in": booking.check_in,
                "check_out": booking.check_out,
                "booking_status": booking.booking_status
            }
        )

    db.close()

    return result
