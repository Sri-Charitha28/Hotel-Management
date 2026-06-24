async function loadReports() {

    try {

        const response =
            await fetch(
                "http://127.0.0.1:8000/dashboard-stats"
            );

        const data =
            await response.json();

        document.getElementById(
            "totalRooms"
        ).innerText =
            data.total_rooms;

        document.getElementById(
            "totalCustomers"
        ).innerText =
            data.total_customers;

        document.getElementById(
            "totalBookings"
        ).innerText =
            data.total_bookings;

        document.getElementById(
            "totalRevenue"
        ).innerText =
            "₹" + data.total_revenue;


        /* ROOM CHART */

        new Chart(
            document.getElementById(
                "roomChart"
            ),
            {
                type: "doughnut",

                data: {

                    labels: [
                        "Available",
                        "Occupied"
                    ],

                    datasets: [{
                        data: [
                            data.available_rooms,
                            data.occupied_rooms
                        ],

                        backgroundColor: [
                            "#2563eb",
                            "#22c55e"
                        ],

                        borderWidth: 0
                    }]
                },

                options: {

                    responsive: true,

                    plugins: {
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            }
        );


        /* BOOKING CHART */

        new Chart(
            document.getElementById(
                "bookingChart"
            ),
            {
                type: "bar",

                data: {

                    labels: [
                        "Booked",
                        "Cancelled"
                    ],

                    datasets: [{

                        data: [
                            data.pending_bookings,
                            data.cancelled_bookings
                        ],

                        backgroundColor: [
                            "#2563eb",
                            "#ef4444"
                        ],

                        borderRadius: 8
                    }]
                },

                options: {

                    responsive: true,

                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            }
        );

    }

    catch(error){

        console.log(error);

    }

}


/* RECENT BOOKINGS */

async function loadRecentBookings(){

    try{

        const response =
            await fetch(
                "http://127.0.0.1:8000/recent-bookings"
            );

        const bookings =
            await response.json();

        const table =
            document.getElementById(
                "recentBookingsTable"
            );

        table.innerHTML = "";

        bookings.forEach(booking => {

            table.innerHTML += `

            <tr>

                <td>
                    BK-${booking.booking_id}
                </td>

                <td>
                    ${booking.customer_name}
                </td>

                <td>
                    ${booking.room_number}
                </td>

                <td>
                    ${booking.check_in}
                </td>

                <td>
                    ${booking.check_out}
                </td>

                <td>

                    <span class="
                    status
                    ${booking.status}
                    ">
                        ${booking.status}
                    </span>

                </td>

            </tr>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}

/* CARD NAVIGATION */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document
        .querySelector(".blue")
        .onclick = () =>
        window.location.href =
        "/rooms-page";

        document
        .querySelector(".green")
        .onclick = () =>
        window.location.href =
        "/admin-customers";

        document
        .querySelector(".orange")
        .onclick = () =>
        window.location.href =
        "/admin-bookings";

    }
);


loadReports();

loadRecentBookings();