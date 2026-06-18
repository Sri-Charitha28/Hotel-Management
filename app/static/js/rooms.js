let allRooms = [];

async function loadRooms() {

    const response = await fetch(
        "http://127.0.0.1:8000/rooms"
    );

    allRooms = await response.json();

    displayRooms(allRooms);
}

function displayRooms(rooms) {

    const tableBody =
        document.querySelector("#roomsTable tbody");

    tableBody.innerHTML = "";

    rooms.forEach(room => {

        let statusClass = "";

        if (room.status.toLowerCase() === "available") {

            statusClass = "available";

        }
        else if (
            room.status.toLowerCase() === "occupied"
        ) {

            statusClass = "occupied";

        }
        else {

            statusClass = "maintenance";

        }

        tableBody.innerHTML += `
            <tr>

                <td>${room.room_number}</td>

                <td>${room.room_type}</td>

                <td>₹${room.price}</td>

                <td>
                    <span class="status ${statusClass}">
                        ${room.status}
                    </span>
                </td>

                <td>

                    <i
                        class="fa-solid fa-pen-to-square edit-btn"
                        data-id="${room.room_id}">
                    </i>

                    <i
                        class="fa-solid fa-trash delete-btn"
                        data-id="${room.room_id}">
                    </i>

                </td>

            </tr>
        `;
    });
}

/* SEARCH */

const searchInput =
    document.querySelector(".table-controls input");

searchInput.addEventListener("keyup", () => {

    const searchValue =
        searchInput.value.toLowerCase();

    const filteredRooms =
        allRooms.filter(room =>

            room.room_number
                .toString()
                .includes(searchValue)

            ||

            room.room_type
                .toLowerCase()
                .includes(searchValue)

        );

    displayRooms(filteredRooms);

});

/* FILTER */

const filterSelect =
    document.querySelector(".table-controls select");

filterSelect.addEventListener("change", () => {

    const selectedStatus =
        filterSelect.value.toLowerCase();

    if (selectedStatus === "all status") {

        displayRooms(allRooms);

        return;
    }

    const filteredRooms =
        allRooms.filter(room =>

            room.status.toLowerCase() ===
            selectedStatus

        );

    displayRooms(filteredRooms);

});

/* MODAL */

const addRoomBtn =
    document.querySelector(".add-room-btn");

const modal =
    document.getElementById("addRoomModal");

const closeModal =
    document.getElementById("closeModal");

addRoomBtn.addEventListener("click", () => {

    roomForm.reset();

    document.getElementById("roomId").value = "";

    modal.style.display = "flex";

});

closeModal.addEventListener("click", () => {

    modal.style.display = "none";

});

/* EDIT ROOM */

document.addEventListener("click", (e) => {

    if (
        e.target.classList.contains("edit-btn")
    ) {

        const roomId =
            e.target.dataset.id;

        const room =
            allRooms.find(

                room =>
                room.room_id == roomId

            );

        document.getElementById(
            "roomId"
        ).value = room.room_id;

        document.getElementById(
            "roomNumber"
        ).value = room.room_number;

        document.getElementById(
            "roomType"
        ).value = room.room_type;

        document.getElementById(
            "roomPrice"
        ).value = room.price;

        document.getElementById(
            "roomStatus"
        ).value = room.status;

        modal.style.display = "flex";
    }

});

/* ADD + UPDATE ROOM */

const roomForm =
    document.getElementById("roomForm");

roomForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        const roomId =
            document.getElementById(
                "roomId"
            ).value;

        const roomData = {

            room_number:
                document.getElementById(
                    "roomNumber"
                ).value,

            room_type:
                document.getElementById(
                    "roomType"
                ).value,

            price:
                parseFloat(

                    document.getElementById(
                        "roomPrice"
                    ).value

                ),

            status:
                document.getElementById(
                    "roomStatus"
                ).value

        };

        let response;

        if (roomId) {

            response =
                await fetch(

                    `http://127.0.0.1:8000/rooms/${roomId}`,

                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                roomData
                            )
                    }

                );

        }
        else {

            response =
                await fetch(

                    "http://127.0.0.1:8000/rooms",

                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                roomData
                            )
                    }

                );
        }

        const result =
            await response.json();

        alert(result.message);

        roomForm.reset();

        document.getElementById(
            "roomId"
        ).value = "";

        modal.style.display = "none";

        loadRooms();
    }
);

/* DELETE ROOM */

document.addEventListener(
    "click",
    async (e) => {

        if (
            e.target.classList.contains(
                "delete-btn"
            )
        ) {

            const roomId =
                e.target.dataset.id;

            const confirmDelete =
                confirm(
                    "Are you sure you want to delete this room?"
                );

            if (!confirmDelete) {

                return;
            }

            const response =
                await fetch(

                    `http://127.0.0.1:8000/rooms/${roomId}`,

                    {
                        method: "DELETE"
                    }

                );

            const result =
                await response.json();

            alert(result.message);

            loadRooms();
        }

    }
);

loadRooms();