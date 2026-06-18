// Check Login

const token = localStorage.getItem("token");

if (!token) {
    window.location.replace("/login");
}


// Load User Data

function loadProfile() {

    const customerName =
        localStorage.getItem("name");

    const customerEmail =
        localStorage.getItem("customerEmail");

    const customerPhone =
        localStorage.getItem("customerPhone");

    // Left Card

    document.getElementById(
        "customerName"
    ).innerText =
        customerName || "Customer";

    document.getElementById(
        "customerEmail"
    ).innerText =
        customerEmail || "Not Available";

    document.getElementById(
        "customerPhone"
    ).innerText =
        customerPhone || "Not Available";


    // Right Form

    document.getElementById(
        "fullName"
    ).value =
        customerName || "";

    document.getElementById(
        "email"
    ).value =
        customerEmail || "";

    document.getElementById(
        "phone"
    ).value =
        customerPhone || "";
}


// Booking Statistics

async function loadBookingStats() {

    try {

        const customerId =
            localStorage.getItem(
                "customerId"
            );

        const response =
            await fetch(
                `http://127.0.0.1:8000/my-bookings/${customerId}`
            );

        const bookings =
            await response.json();

        document.getElementById(
            "totalBookings"
        ).innerText =
            bookings.length;

        const activeBookings =
            bookings.filter(
                booking =>
                booking.booking_status === "booked"
            );

        document.getElementById(
            "activeBookings"
        ).innerText =
            activeBookings.length;

    }
    catch (error) {

        console.log(error);

    }

}


// Logout

function logout() {

    localStorage.clear();

    window.location.replace(
        "/login"
    );
}


// Rooms Page

function openAllRooms() {

    window.location.href =
        "/customer-rooms";
}


// Initial Load

loadProfile();

loadBookingStats();