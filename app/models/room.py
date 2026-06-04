from sqlalchemy import Column, Integer, String, Numeric
from app.database.base import Base
from app.database.db import SessionLocal


class Room(Base):
    __tablename__ = "rooms"

    room_id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String(10), unique=True, nullable=False)
    room_type = Column(String(50), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    status = Column(String(20), default="available")


# ---------------- CREATE ----------------

def create_room(room_number, room_type, price, status="available"):
    db = SessionLocal()

    new_room = Room(
        room_number=room_number,
        room_type=room_type,
        price=price,
        status=status
    )

    db.add(new_room)
    db.commit()

    print("Room Added Successfully!")

    db.close()


# ---------------- READ ----------------

def read_rooms():
    db = SessionLocal()

    rooms = db.query(Room).all()

    for room in rooms:
        print(
            room.room_id,
            room.room_number,
            room.room_type,
            room.price,
            room.status
        )

    db.close()


# ---------------- UPDATE ----------------

def update_room(room_number, new_status):
    db = SessionLocal()

    room = db.query(Room).filter(
        Room.room_number == room_number
    ).first()

    if room:
        room.status = new_status
        db.commit()
        print("Room Updated Successfully!")
    else:
        print("Room Not Found!")

    db.close()


# ---------------- DELETE ----------------

def delete_room(room_number):
    db = SessionLocal()

    room = db.query(Room).filter(
        Room.room_number == room_number
    ).first()

    if room:
        db.delete(room)
        db.commit()
        print("Room Deleted Successfully!")
    else:
        print("Room Not Found!")

    db.close()