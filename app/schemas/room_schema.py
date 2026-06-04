from pydantic import BaseModel


class RoomBase(BaseModel):
    room_number: str
    room_type: str
    price: float
    status: str


class RoomCreate(RoomBase):
    pass


class RoomResponse(RoomBase):
    room_id: int

    class Config:
        from_attributes = True