const token = localStorage.getItem("token");

if (!token) {

    window.location.replace("/login");

}

async function loadDashboardStats() {

    try {

        const response = await fetch(

            "http://127.0.0.1:8000/dashboard-stats",

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        if (response.status === 401) {

            alert("Session Expired");

            localStorage.clear();

            window.location.replace("/login");

            return;

        }

        if (response.status === 403) {

            alert("Admin Access Only");

            window.location.replace("/home");

            return;

        }

        const data = await response.json();

        document.getElementById("totalRooms").innerText =
            data.total_rooms;

        document.getElementById("totalBookings").innerText =
            data.total_bookings;

        document.getElementById("totalCustomers").innerText =
            data.total_customers;

        document.getElementById("totalRevenue").innerText =
            "₹" + data.total_revenue;

        document.getElementById("availableRooms").innerText =
            data.available_rooms;

        document.getElementById("occupiedRooms").innerText =
            data.occupied_rooms;

        document.getElementById("pendingBookings").innerText =
            data.pending_bookings;

        document.getElementById("cancelledBookings").innerText =
            data.cancelled_bookings;

        const chartCanvas =
            document.getElementById("roomChart");

        Chart.getChart(chartCanvas)?.destroy();

        new Chart(chartCanvas, {

            type: "doughnut",

            data: {

                labels: [

                    "Available",

                    "Occupied"

                ],

                datasets: [

                    {

                        data: [

                            data.available_rooms,

                            data.occupied_rooms

                        ]

                    }

                ]

            }

        });

    }

    catch (error) {

        console.log(error);

    }

}

async function loadRecentBookings() {

    try {

        const response = await fetch(

            "http://127.0.0.1:8000/recent-bookings",

            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

        );

        const data = await response.json();

        let rows = "";

        data.forEach(booking => {

            rows += `

            <tr>

                <td>${booking.booking_id}</td>

                <td>${booking.customer_name}</td>

                <td>${booking.room_number}</td>

                <td>${booking.status}</td>

            </tr>

            `;

        });

        document.getElementById(
            "recentBookingsBody"
        ).innerHTML = rows;

    }

    catch (error) {

        console.log(error);

    }

}

loadDashboardStats();

loadRecentBookings();