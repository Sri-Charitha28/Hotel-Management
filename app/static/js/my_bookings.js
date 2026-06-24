let allBookings = [];
let currentFilter = "all";

const token = localStorage.getItem("token");

if (!token) {
    window.location.replace("/login");
}

async function loadBookings() {

    try {

        const customerId =
            localStorage.getItem("customerId");

        const response =
            await fetch(
                `http://127.0.0.1:8000/my-bookings/${customerId}`
            );

        allBookings =
            await response.json();

        document.getElementById(
            "totalBookings"
        ).innerText =
            allBookings.length;

        document.getElementById(
            "activeBookings"
        ).innerText =
            allBookings.filter(
                booking =>
                    booking.booking_status === "booked"
            ).length;

        document.getElementById(
            "completedBookings"
        ).innerText =
            allBookings.filter(
                booking =>
                    booking.booking_status === "completed"
            ).length;

        document.getElementById(
            "cancelledBookings"
        ).innerText =
            allBookings.filter(
                booking =>
                    booking.booking_status === "cancelled"
            ).length;

        const savedFilter =
    localStorage.getItem(
        "bookingFilter"
    );

if (savedFilter) {

    currentFilter =
        savedFilter;

    const filtered =
        allBookings.filter(
            booking =>
                savedFilter === "all"
                ||
                booking.booking_status === savedFilter
        );

    renderBookings(
        filtered
    );

    localStorage.removeItem(
        "bookingFilter"
    );

}
else {

    renderBookings(
        allBookings
    );

}

    }
    catch (error) {

        console.log(error);

    }

}

function renderBookings(bookings) {

    const container =
        document.getElementById(
            "bookingsContainer"
        );

    container.innerHTML = "";

    if (bookings.length === 0) {

        let message =
            "No records available";

        if (
            currentFilter === "booked"
        ) {

            message =
                "No Active Bookings Found";

        }
        else if (
            currentFilter === "completed"
        ) {

            message =
                "No Completed Bookings Found";

        }
        else if (
            currentFilter === "cancelled"
        ) {

            message =
                "No Cancelled Bookings Found";

        }

        container.innerHTML = `
            <div class="no-bookings">
                <h2>
                    📅 ${message}
                </h2>

                <p>
                    Try another filter
                </p>
            </div>
        `;

        return;
    }

    bookings.forEach(booking => {

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "booking-card";

        let imagePath =
            "/static/images/rooms/default.jpg";

        const roomType =
            booking.room_type.toLowerCase();

        if (
            roomType === "single"
        ) {

            imagePath =
                "/static/images/rooms/single.jpg";

        }
        else if (
            roomType === "double"
        ) {

            imagePath =
                "/static/images/rooms/double.jpg";

        }
        else if (
            roomType === "deluxe"
        ) {

            imagePath =
                "/static/images/rooms/deluxe.jpg";

        }
        else if (
            roomType === "premium"
        ) {

            imagePath =
                "/static/images/rooms/premium.jpg";

        }
        else if (
            roomType === "suite"
        ) {

            imagePath =
                "/static/images/rooms/suite.jpg";

        }

        let statusClass =
            "status-booked";

        let statusText =
            "✅ Active";

        if (
            booking.booking_status ===
            "completed"
        ) {

            statusClass =
                "status-completed";

            statusText =
                "⏰ Completed";

        }

        if (
            booking.booking_status ===
            "cancelled"
        ) {

            statusClass =
                "status-cancelled";

            statusText =
                "❌ Cancelled";

        }

        let cancelButton = "";

        if (
            booking.booking_status ===
            "booked"
        ) {

            cancelButton = `
                <button
                    class="cancel-btn"
                    onclick="cancelBooking(${booking.booking_id})"
                >
                    🗑 Cancel Booking
                </button>
            `;

        }

        card.innerHTML = `

            <img
                src="${imagePath}"
                alt="${booking.room_type}"
                class="booking-room-image"
            >

            <div class="booking-content">

                <div class="booking-top">

                    <h3>
                        Room ${booking.room_number}
                    </h3>

                    <span
                        class="${statusClass}"
                    >
                        ${statusText}
                    </span>

                </div>

                <div class="room-type-badge">
                    🛏️ ${booking.room_type} Room
                </div>

                <div class="booking-details-grid">

                    <div class="detail-box">

                        <span class="detail-icon">
                            ₹
                        </span>

                        <div>

                            <strong>
                                ₹${booking.price}
                            </strong>

                            <p>
                                Per Night
                            </p>

                        </div>

                    </div>

                    <div class="detail-box">

                        <span class="detail-icon">
                            📅
                        </span>

                        <div>

                            <strong>
                                ${booking.check_in}
                            </strong>

                            <p>
                                Check In
                            </p>

                        </div>

                    </div>

                    <div class="detail-box">

                        <span class="detail-icon">
                            📅
                        </span>

                        <div>

                            <strong>
                                ${booking.check_out}
                            </strong>

                            <p>
                                Check Out
                            </p>

                        </div>

                    </div>

                </div>

                <div class="booking-footer">

                    <span>
                        📋 Booking ID :
                        ${booking.booking_id}
                    </span>

                    ${cancelButton}

                </div>

            </div>

        `;

        container.appendChild(
            card
        );

    });

}

function filterBookings(
    status,
    button
) {

    currentFilter = status;

    document
        .querySelectorAll(
            ".filter-btn"
        )
        .forEach(btn =>
            btn.classList.remove(
                "active"
            )
        );

    if (button) {

        button.classList.add(
            "active"
        );

    }

    if (
        status === "all"
    ) {

        renderBookings(
            allBookings
        );

        return;
    }

    const filtered =
        allBookings.filter(
            booking =>
                booking.booking_status === status
        );

    renderBookings(
        filtered
    );

}

function sortBookings() {

    const sortType =
        document.getElementById(
            "sortBookings"
        ).value;

    let filtered =
        [...allBookings];

    if (
        currentFilter !==
        "all"
    ) {

        filtered =
            filtered.filter(
                booking =>
                    booking.booking_status === currentFilter
            );

    }

    filtered.sort(
        (a, b) => {

            if (
                sortType ===
                "latest"
            ) {

                return (
                    new Date(
                        b.check_in
                    ) -
                    new Date(
                        a.check_in
                    )
                );

            }

            return (
                new Date(
                    a.check_in
                ) -
                new Date(
                    b.check_in
                )
            );

        }
    );

    renderBookings(
        filtered
    );

}

async function cancelBooking(
    bookingId
) {

    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this booking?"
        );

    if (
        !confirmCancel
    ) {

        return;

    }

    try {

        const response =
            await fetch(
                `http://127.0.0.1:8000/bookings/${bookingId}`,
                {
                    method:
                        "DELETE"
                }
            );

        const data =
            await response.json();

        alert(
            data.message
        );

        loadBookings();

    }
    catch (error) {

        console.log(
            error
        );

        alert(
            "Failed to cancel booking"
        );

    }

}

function logout() {

    localStorage.clear();

    sessionStorage.clear();

    window.location.href =
        "/login";

}

loadBookings();
const customerName =
localStorage.getItem(
    "customerName"
);

const welcomeUser =
document.getElementById(
    "welcomeUser"
);

if(
    welcomeUser &&
    customerName
){
    welcomeUser.innerText =
    `Welcome, ${customerName}`;
}