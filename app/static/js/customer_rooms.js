let allRooms = [];

let currentPage = 1;

const roomsPerPage = 5;

async function loadRooms() {

    try {

        const checkIn =
            localStorage.getItem(
                "searchCheckIn"
            );

        const checkOut =
            localStorage.getItem(
                "searchCheckOut"
            );

        let url =
            "http://127.0.0.1:8000/customer-rooms-data";

        if (
            checkIn &&
            checkOut
        ) {

            url =
                `http://127.0.0.1:8000/available-rooms?check_in=${checkIn}&check_out=${checkOut}`;

        }

        const response =
            await fetch(url);

        allRooms =
            await response.json();

        renderRooms();

    }
    catch (error) {

        console.error(error);

    }

}

function renderRooms() {

    const container =
        document.getElementById(
            "roomsContainer"
        );

    container.innerHTML = "";

    const start =
        (currentPage - 1) *
        roomsPerPage;

    const end =
        start +
        roomsPerPage;

    const rooms =
        allRooms.slice(
            start,
            end
        );

    rooms.forEach(room => {

        const card =
            document.createElement("div");

        card.className =
            "room-card";

        let imagePath =
            "/static/images/rooms/default.jpg";

        if (
            room.room_type.toLowerCase() ===
            "single"
        ) {

            imagePath =
                "/static/images/rooms/single.jpg";

        }
        else if (
            room.room_type.toLowerCase() ===
            "double"
        ) {

            imagePath =
                "/static/images/rooms/double.jpg";

        }
        else if (
            room.room_type.toLowerCase() ===
            "deluxe"
        ) {

            imagePath =
                "/static/images/rooms/deluxe.jpg";

        }
        else if (
            room.room_type.toLowerCase() ===
            "suite"
        ) {

            imagePath =
                "/static/images/rooms/suite.jpg";

        }
        else if (
            room.room_type.toLowerCase() ===
            "premium"
        ) {

            imagePath =
                "/static/images/rooms/premium.jpg";

        }

        card.innerHTML = `
            <img
                src="${imagePath}"
                alt="${room.room_type}"
                class="room-image"
            >

            <h3>
                Room ${room.room_number}
            </h3>

            <p>
                <strong>Type:</strong>
                ${room.room_type}
            </p>

            <p>
                <strong>Price:</strong>
                ₹${room.price}
            </p>

            <p class="available">
                Available
            </p>

            <button
                class="book-room-btn"
                onclick="bookRoom(${room.room_id})"
            >
                Book Now
            </button>
        `;

        container.appendChild(
            card
        );

    });

    renderPagination();

}

function renderPagination() {

    const pagination =
        document.getElementById(
            "pagination"
        );

    pagination.innerHTML = "";

    const totalPages =
        Math.ceil(
            allRooms.length /
            roomsPerPage
        );

    const prevBtn =
        document.createElement(
            "button"
        );

    prevBtn.innerText =
        "Previous";

    prevBtn.disabled =
        currentPage === 1;

    prevBtn.onclick = () => {

        currentPage--;

        renderRooms();

    };

    pagination.appendChild(
        prevBtn
    );

    for (
        let i = 1;
        i <= totalPages;
        i++
    ) {

        const pageBtn =
            document.createElement(
                "button"
            );

        pageBtn.innerText = i;

        if (
            i === currentPage
        ) {

            pageBtn.classList.add(
                "active"
            );

        }

        pageBtn.onclick = () => {

            currentPage = i;

            renderRooms();

        };

        pagination.appendChild(
            pageBtn
        );

    }

    const nextBtn =
        document.createElement(
            "button"
        );

    nextBtn.innerText =
        "Next";

    nextBtn.disabled =
        currentPage === totalPages;

    nextBtn.onclick = () => {

        currentPage++;

        renderRooms();

    };

    pagination.appendChild(
        nextBtn
    );

}

function bookRoom(roomId) {

    localStorage.setItem(
        "selectedRoomId",
        roomId
    );

    window.location.href =
        "/booking-form";

}

function logout() {

    localStorage.clear();

    sessionStorage.clear();

    window.location.replace(
        "/login"
    );

}

loadRooms();