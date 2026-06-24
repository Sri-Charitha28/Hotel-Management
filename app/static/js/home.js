const token = localStorage.getItem("token");

if (!token) {

    window.location.replace("/login");

}

window.history.pushState(
    null,
    null,
    window.location.href
);

window.onpopstate = function () {

    window.history.pushState(
        null,
        null,
        window.location.href
    );

};

// Search Rooms

async function searchRooms() {

    const checkIn =
        document.getElementById(
            "checkIn"
        ).value;

    const checkOut =
        document.getElementById(
            "checkOut"
        ).value;

    if (
        !checkIn ||
        !checkOut
    ) {

        alert(
            "Please select Check-In and Check-Out dates"
        );

        return;

    }

    const today =
        new Date();

    today.setHours(
        0, 0, 0, 0
    );

    const checkInDate =
        new Date(checkIn);

    if (
        checkInDate < today
    ) {

        alert(
            "Check-In date cannot be in the past"
        );

        return;

    }

    if (
        new Date(checkOut) <=
        new Date(checkIn)
    ) {

        alert(
            "Check-Out date must be after Check-In date"
        );

        return;

    }

    localStorage.setItem(
        "searchCheckIn",
        checkIn
    );

    localStorage.setItem(
        "searchCheckOut",
        checkOut
    );

    window.location.href =
        "/customer-rooms";

}

// Open All Rooms

function openAllRooms() {

    localStorage.removeItem(
        "searchCheckIn"
    );

    localStorage.removeItem(
        "searchCheckOut"
    );

    window.location.href =
        "/customer-rooms";

}

// Logout

function logout() {

    localStorage.clear();

    sessionStorage.clear();

    window.location.replace(
        "/login"
    );

}