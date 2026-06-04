from datetime import date

from app.models.booking import (
    create_booking,
    read_bookings,
    update_booking,
    delete_booking
)

# CREATE
create_booking(
    customer_id=1,
    room_id=1,
    check_in=date(2026, 6, 10),
    check_out=date(2026, 6, 15)
)

# READ
read_bookings()

# UPDATE
update_booking(
    1,
    "checked-in"
)

# READ AGAIN
read_bookings()


