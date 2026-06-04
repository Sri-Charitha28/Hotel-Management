from pydantic import BaseModel
from datetime import date


class BookingBase(BaseModel):
    customer_id: int
    room_id: int
    check_in: date
    check_out: date
    booking_status: str


class BookingCreate(BookingBase):
    pass


class BookingResponse(BookingBase):
    booking_id: int

    class Config:
        from_attributes = True