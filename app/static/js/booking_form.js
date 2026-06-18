document.getElementById(
    "roomIdDisplay"
).innerText =
    localStorage.getItem(
        "selectedRoomId"
    );

const token = localStorage.getItem("token");

if (!token) {

    window.location.replace("/login");

}

// Total Nights Calculation

function calculateNights() {

    const checkIn =
        document.getElementById(
            "checkIn"
        ).value;

    const checkOut =
        document.getElementById(
            "checkOut"
        ).value;

    if (checkIn && checkOut) {

        const start =
            new Date(checkIn);

        const end =
            new Date(checkOut);

        const diff =
            (end - start) /
            (1000 * 60 * 60 * 24);

        document.getElementById(
            "totalNights"
        ).innerText =
            diff > 0 ? diff : 0;
    }
}

document.getElementById(
    "checkIn"
).addEventListener(
    "change",
    calculateNights
);

document.getElementById(
    "checkOut"
).addEventListener(
    "change",
    calculateNights
);

// Booking Form Submit

document
    .getElementById("bookingForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const checkIn =
            document.getElementById(
                "checkIn"
            ).value;

        const checkOut =
            document.getElementById(
                "checkOut"
            ).value;

        const guests =
            document.getElementById(
                "guests"
            ).value;

        const roomId =
            localStorage.getItem(
                "selectedRoomId"
            );

        const customerId =
            localStorage.getItem(
                "customerId"
            );

        if (!checkIn || !checkOut) {

            alert(
                "Please select dates"
            );

            return;
        }

        if (checkOut <= checkIn) {

            alert(
                "Check-out date must be after Check-in date"
            );

            return;
        }

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/bookings",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        customer_id:
                            Number(customerId),

                        room_id:
                            Number(roomId),

                        check_in:
                            checkIn,

                        check_out:
                            checkOut,

                        booking_status:
                            "booked"

                    })
                }
            );

            const data =
                await response.json();

            if (response.ok) {

                alert(
                    "Booking Submitted Successfully"
                );

                window.location.href =
                    "/customer-rooms";

            } else {

                alert(
                    data.detail ||
                    data.message ||
                    "Booking Failed"
                );

            }

        } catch (error) {

            console.error(error);

            alert(
                "Booking Failed"
            );

        }

    });