from sqlalchemy import Column, Integer, String, Date, ForeignKey
from app.database.base import Base
from app.database.db import SessionLocal

from app.models.room import Room
from app.models.customers import Customer


class Booking(Base):
    __tablename__ = "bookings"

    booking_id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.customer_id"))
    room_id = Column(Integer, ForeignKey("rooms.room_id"))
    check_in = Column(Date, nullable=False)
    check_out = Column(Date, nullable=False)
    booking_status = Column(String(20), default="booked")


# ---------------- CREATE ----------------

def create_booking(customer_id, room_id, check_in, check_out):
    db = SessionLocal()

    new_booking = Booking(
        customer_id=customer_id,
        room_id=room_id,
        check_in=check_in,
        check_out=check_out
    )

    db.add(new_booking)
    db.commit()

    print("Booking Added Successfully!")

    db.close()


# ---------------- READ ----------------

def read_bookings():
    db = SessionLocal()

    bookings = db.query(Booking).all()

    for booking in bookings:
        print(
            booking.booking_id,
            booking.customer_id,
            booking.room_id,
            booking.check_in,
            booking.check_out,
            booking.booking_status
        )

    db.close()


# ---------------- UPDATE ----------------

def update_booking(booking_id, new_status):
    db = SessionLocal()

    booking = db.query(Booking).filter(
        Booking.booking_id == booking_id
    ).first()

    if booking:
        booking.booking_status = new_status
        db.commit()
        print("Booking Updated Successfully!")
    else:
        print("Booking Not Found!")

    db.close()


# ---------------- DELETE ----------------

def delete_booking(booking_id):
    db = SessionLocal()

    booking = db.query(Booking).filter(
        Booking.booking_id == booking_id
    ).first()

    if booking:
        db.delete(booking)
        db.commit()
        print("Booking Deleted Successfully!")
    else:
        print("Booking Not Found!")

    db.close()