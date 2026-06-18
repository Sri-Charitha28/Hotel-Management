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


// Search Rooms Button

const searchBtn =
    document.querySelector(
        ".search-btn"
    );

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        function () {

            const checkIn =
                document.querySelectorAll(
                    'input[type="date"]'
                )[0].value;

            const checkOut =
                document.querySelectorAll(
                    'input[type="date"]'
                )[1].value;

            if (
                !checkIn ||
                !checkOut
            ) {

                alert(
                    "Please select Check-In and Check-Out dates"
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
    );

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

// Logout

function logout() {

    localStorage.clear();

    sessionStorage.clear();

    window.location.replace(
        "/login"
    );

}