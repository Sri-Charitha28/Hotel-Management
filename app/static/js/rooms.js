let allRooms = [];
let filteredRooms = [];

let currentPage = 1;
const rowsPerPage = 6;
const roomDate = document.getElementById("roomDate");

const today = new Date();

const yyyy = today.getFullYear();

const mm = String(today.getMonth() + 1).padStart(2, "0");

const dd = String(today.getDate()).padStart(2, "0");

roomDate.value = `${yyyy}-${mm}-${dd}`;
const token = localStorage.getItem("token");

/* LOAD ROOMS */
async function loadRooms() {

    const selectedDate =
        document.getElementById("roomDate").value;
        console.log(selectedDate); 

    let url =
        "http://127.0.0.1:8000/rooms";

    if(selectedDate){

        url +=
            `?selected_date=${selectedDate}`;

    }

    const response =
    await fetch(url, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    allRooms =
        await response.json();

    filteredRooms =
        allRooms;

    currentPage = 1;

    displayRooms(filteredRooms);
}
/* DISPLAY ROOMS */

function displayRooms(rooms) {


const tableBody =
    document.querySelector(
        "#roomsTable tbody"
    );

tableBody.innerHTML = "";

const start =
    (currentPage - 1)
    * rowsPerPage;

const end =
    start + rowsPerPage;

const paginatedRooms =
    rooms.slice(
        start,
        end
    );

paginatedRooms.forEach(room => {

    let statusClass = "";

    if(
        room.status.toLowerCase()
        === "available"
    ){

        statusClass =
            "available";

    }

    else if(
        room.status.toLowerCase()
        === "occupied"
    ){

        statusClass =
            "occupied";

    }

    else{

        statusClass =
            "maintenance";

    }

    tableBody.innerHTML += `

    <tr>

        <td>
            ${room.room_number}
        </td>

        <td>
            ${room.room_type}
        </td>

        <td>
            ₹${room.price}
        </td>

        <td>

            <span
                class="
                status
                ${statusClass}
                "
            >
                ${room.status}
            </span>

        </td>

        <td>

            <i
                class="
                fa-solid
                fa-pen-to-square
                edit-btn
                "
                data-id="${room.room_id}"
            ></i>

            <i
                class="
                fa-solid
                fa-trash
                delete-btn
                "
                data-id="${room.room_id}"
            ></i>

        </td>

    </tr>

    `;
});

renderPagination(rooms);


}

/* PAGINATION */

function renderPagination(rooms){


const totalPages =
    Math.ceil(
        rooms.length /
        rowsPerPage
    );

const pagination =
    document.getElementById(
        "pagination"
    );

pagination.innerHTML = "";

if(totalPages <= 1){

    return;

}

for(
    let i = 1;
    i <= totalPages;
    i++
){

    pagination.innerHTML += `

    <button
        class="
        page-btn
        ${i === currentPage ? 'active' : ''}
        "
        onclick="
        changePage(${i})
        "
    >
        ${i}
    </button>

    `;
}


}

function changePage(page){


currentPage = page;

displayRooms(filteredRooms);


}

/* SEARCH */

const searchInput =
document.querySelector(
".table-controls input"
);

searchInput.addEventListener(
"keyup",
() => {


    const searchValue =
        searchInput.value.toLowerCase();

    filteredRooms =
        allRooms.filter(room =>

            room.room_number
            .toString()
            .includes(searchValue)

            ||

            room.room_type
            .toLowerCase()
            .includes(searchValue)

        );

    currentPage = 1;

    displayRooms(
        filteredRooms
    );

}

);

/* FILTER */

const filterSelect =
document.querySelector(
".table-controls select"
);

filterSelect.addEventListener(
"change",
() => {

    const selectedStatus =
        filterSelect.value.toLowerCase();

    if(
        selectedStatus ===
        "all status"
    ){

        filteredRooms =
            allRooms;

    }

    else{

        filteredRooms =
            allRooms.filter(room =>

                room.status
                .toLowerCase()
                === selectedStatus

            );

    }

    currentPage = 1;

    displayRooms(
        filteredRooms
    );

}

);

/* MODAL */

const addRoomBtn =
document.querySelector(
".add-room-btn"
);

const modal =
document.getElementById(
"addRoomModal"
);

const closeModal =
document.getElementById(
"closeModal"
);

addRoomBtn.addEventListener(
"click",
() => {


    roomForm.reset();

    document.getElementById(
        "roomId"
    ).value = "";

    modal.style.display =
        "flex";

}


);

closeModal.addEventListener(
"click",
() => {


    modal.style.display =
        "none";

}


);

/* EDIT ROOM */

document.addEventListener(
"click",
(e) => {


    if(
        e.target.classList.contains(
            "edit-btn"
        )
    ){

        const roomId =
            e.target.dataset.id;

        const room =
            allRooms.find(

                room =>
                room.room_id ==
                roomId

            );

        document.getElementById(
            "roomId"
        ).value =
            room.room_id;

        document.getElementById(
            "roomNumber"
        ).value =
            room.room_number;

        document.getElementById(
            "roomType"
        ).value =
            room.room_type;

        document.getElementById(
            "roomPrice"
        ).value =
            room.price;

        document.getElementById(
            "roomStatus"
        ).value =
            room.status;

        modal.style.display =
            "flex";
    }

}


);

/* ADD + UPDATE ROOM */

const roomForm =
document.getElementById(
"roomForm"
);

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
    console.log(roomData);

    if(roomId){

        response =
            await fetch(

                `http://127.0.0.1:8000/rooms/${roomId}`,

                {
                    method:"PUT",

                    headers:{
    "Content-Type":"application/json",
    "Authorization": `Bearer ${token}`
},
                    body:
                    JSON.stringify(
                        roomData
                    )
                }

            );

    }

    else{

        response =
            await fetch(

                "http://127.0.0.1:8000/rooms",

                {
                    method:"POST",

                    headers:{
    "Content-Type":"application/json",
    "Authorization": `Bearer ${token}`
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

    alert(
        result.message
    );

    roomForm.reset();

    document.getElementById(
        "roomId"
    ).value = "";

    modal.style.display =
        "none";
    

    loadRooms();

}


);

/* DELETE ROOM */

document.addEventListener(
"click",
async (e) => {


    if(
        e.target.classList.contains(
            "delete-btn"
        )
    ){

        const roomId =
            e.target.dataset.id;

        const confirmDelete =
            confirm(
                "Are you sure you want to delete this room?"
            );

        if(!confirmDelete){

            return;

        }

        const response =
            await fetch(

                `http://127.0.0.1:8000/rooms/${roomId}`,

                {
    method:"DELETE",
    headers:{
        "Authorization": `Bearer ${token}`
    }
}
            );

        const result =
            await response.json();

        alert(
            result.message
        );

        loadRooms();

    }

}


);
roomDate.addEventListener(
    "change",
    () => {

        console.log("Date Changed");

        loadRooms();

    }
);

loadRooms();
