from fastapi import APIRouter
from app.schemas.room_schema import RoomCreate

router = APIRouter()

@router.get("/rooms")
def get_rooms():
    return {"message": "All Rooms"}

@router.post("/rooms")
def create_room(room: RoomCreate):
    return {
        "message": "Room Created Successfully",
        "data": room
    }

@router.put("/rooms/{room_id}")
def update_room(room_id: int, room: RoomCreate):
    return {
        "message": f"Room {room_id} Updated Successfully",
        "data": room
    }

@router.delete("/rooms/{room_id}")
def delete_room(room_id: int):
    return {
        "message": f"Room {room_id} Deleted Successfully"
    }