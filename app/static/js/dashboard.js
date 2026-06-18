async function loadDashboard() {

    try {

        const roomsResponse =
            await fetch(
                "http://127.0.0.1:8000/rooms"
            );

        const rooms =
            await roomsResponse.json();

        document.getElementById(
            "totalRooms"
        ).innerText = rooms.length;


        const customersResponse =
            await fetch(
                "http://127.0.0.1:8000/customers"
            );

        const customers =
            await customersResponse.json();

        document.getElementById(
            "totalCustomers"
        ).innerText = customers.length;


        const bookingsResponse =
            await fetch(
                "http://127.0.0.1:8000/bookings"
            );

        const bookings =
            await bookingsResponse.json();

        document.getElementById(
            "totalBookings"
        ).innerText = bookings.length;


        document.getElementById(
            "totalRevenue"
        ).innerText = "₹0";

    }

    catch(error) {

        console.log(error);

    }

}

loadDashboard();