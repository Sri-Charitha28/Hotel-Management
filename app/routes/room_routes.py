from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates
from app.schemas.room_schema import RoomCreate
from app.models.room import Room
from app.database.db import SessionLocal
from fastapi import Query
from app.models.booking import Booking
from datetime import date
from fastapi import Request
from fastapi.responses import RedirectResponse
from fastapi import Depends
from app.auth.oauth2 import get_current_admin

templates = Jinja2Templates(directory="app/templates")

templates = Jinja2Templates(
    directory="app/templates"
)

router = APIRouter()


# ---------------- GET ALL ROOMS ----------------
@router.get("/rooms")
def get_rooms(
    selected_date: date | None = Query(None),
    current_user: dict = Depends(get_current_admin)
):

    db = SessionLocal()

    rooms = db.query(Room).order_by(Room.room_id).all()

    result = []

    for room in rooms:

        status = room.status

        if selected_date:

            booking = db.query(Booking).filter(
                Booking.room_id == room.room_id,
                Booking.check_in <= selected_date,
                Booking.check_out > selected_date,
                Booking.booking_status == "booked"
            ).first()

            if booking:
                status = "occupied"

        result.append(
            {
                "room_id": room.room_id,
                "room_number": room.room_number,
                "room_type": room.room_type,
                "price": float(room.price),
                "status": status
            }
        )

    db.close()

    return result

@router.get("/available-rooms")
def get_available_rooms(
    check_in: date = Query(...),
    check_out: date = Query(...)
):

    db = SessionLocal()

    booked_room_ids = db.query(
        Booking.room_id
    ).filter(
        Booking.check_in < check_out,
        Booking.check_out > check_in
    ).all()

    booked_room_ids = [
        room[0]
        for room in booked_room_ids
    ]

    rooms = db.query(Room).filter(
        ~Room.room_id.in_(booked_room_ids)
    ).all()

    result = []

    for room in rooms:

        result.append(
            {
                "room_id": room.room_id,
                "room_number": room.room_number,
                "room_type": room.room_type,
                "price": float(room.price),
                "status": "available"
            }
        )

    db.close()

    return result

# ---------------- CREATE ROOM ----------------

@router.post("/rooms")
def create_room(
    room: RoomCreate,
    current_user: dict = Depends(get_current_admin)
):

    db = SessionLocal()

    new_room = Room(
        room_number=room.room_number,
        room_type=room.room_type,
        price=room.price,
        status=room.status
    )

    db.add(new_room)
    db.commit()
    db.refresh(new_room)

    result = {
        "room_id": new_room.room_id,
        "room_number": new_room.room_number,
        "room_type": new_room.room_type,
        "price": float(new_room.price),
        "status": new_room.status
    }

    db.close()

    return {
        "message": "Room Created Successfully",
        "data": result
    }


# ---------------- UPDATE ROOM ----------------

@router.put("/rooms/{room_id}")
def update_room(
    room_id: int,
    room: RoomCreate,
    current_user: dict = Depends(get_current_admin)
):

    db = SessionLocal()

    existing_room = db.query(Room).filter(
        Room.room_id == room_id
    ).first()

    if not existing_room:
        db.close()
        return {"message": "Room Not Found"}

    existing_room.room_number = room.room_number
    existing_room.room_type = room.room_type
    existing_room.price = room.price
    existing_room.status = room.status

    db.commit()

    result = {
        "room_id": existing_room.room_id,
        "room_number": existing_room.room_number,
        "room_type": existing_room.room_type,
        "price": float(existing_room.price),
        "status": existing_room.status
    }

    db.close()

    return {
        "message": "Room Updated Successfully",
        "data": result
    }


# ---------------- DELETE ROOM ----------------

@router.delete("/rooms/{room_id}")
def delete_room(
    room_id: int,
    current_user: dict = Depends(get_current_admin)
):
    db = SessionLocal()

    room = db.query(Room).filter(
        Room.room_id == room_id
    ).first()

    if not room:
        db.close()
        return {"message": "Room Not Found"}

    db.delete(room)
    db.commit()

    db.close()

    return {
        "message": "Room Deleted Successfully"
    }
@router.get("/my-bookings")
def my_bookings_page(
    request: Request
):
    return templates.TemplateResponse(
        request=request,
        name="my_bookings.html"
    )
@router.get("/profile")
def profile_page(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="profile.html"
    )
@router.get("/admin-bookings")
def admin_bookings_page(request: Request):

    return templates.TemplateResponse(
    request=request,
    name="admin_bookings.html",
    context={
        "active_page": "bookings"
    }
)

@router.get("/admin-customers")
def customers_page(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="admin_customers.html",
        context={
            "active_page": "customers"
        }
    )
@router.get("/admin-reports")
def reports_page(request: Request):

    return templates.TemplateResponse(
        request=request,
        name="admin_reports.html",
        context={
            "active_page":"reports"
        }
    )

    return templates.TemplateResponse(
        request=request,
        name="admin_reports.html",
        context={
            "active_page":"reports"
        }
    )

@router.get("/logout")
def logout(request: Request):

    request.session.clear()

    return RedirectResponse(
        url="/login",
        status_code=302
    )
@router.get("/customer-rooms-data")
def get_customer_rooms():

    db = SessionLocal()

    rooms = db.query(Room).order_by(
        Room.room_id
    ).all()

    result = []

    for room in rooms:

        result.append(
            {
                "room_id": room.room_id,
                "room_number": room.room_number,
                "room_type": room.room_type,
                "price": float(room.price),
                "status": room.status
            }
        )

    db.close()

    return result