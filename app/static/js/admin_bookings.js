let allBookings = [];

let selectedBooking = null;

async function loadBookings() {

    try {

        const response =
            await fetch(
                "http://127.0.0.1:8000/admin-bookings-data"
            );

        allBookings =
            await response.json();

        renderBookings(allBookings);

    }

    catch(error){

        console.log(error);

    }

}

function renderBookings(bookings){

    const table =
        document.getElementById(
            "bookingsTable"
        );

    table.innerHTML = "";

    bookings.forEach(booking => {

        let statusClass =
            booking.booking_status.toLowerCase();

        table.innerHTML += `

        <tr>

            <td>
                #BK${booking.booking_id}
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

                <span
                    class="status ${statusClass}"
                >
                    ${booking.booking_status}
                </span>

            </td>

            <td class="actions">

                <i
                    class="fa-solid fa-pen"
                    onclick="editBooking(${booking.booking_id})"
                ></i>

                <i
                    class="fa-solid fa-trash"
                    onclick="cancelBooking(${booking.booking_id})"
                ></i>

            </td>

        </tr>

        `;

    });

}

function editBooking(id){

    selectedBooking =
        allBookings.find(
            booking =>
            booking.booking_id === id
        );

    document.getElementById(
        "editRoomId"
    ).value =
        selectedBooking.room_id;

    document.getElementById(
        "editCheckIn"
    ).value =
        selectedBooking.check_in;

    document.getElementById(
        "editCheckOut"
    ).value =
        selectedBooking.check_out;

    document.getElementById(
        "editStatus"
    ).value =
        selectedBooking.booking_status;

    document.getElementById(
        "editModal"
    ).style.display = "flex";
}

async function cancelBooking(id){

    const confirmDelete =
        confirm(
            "Cancel this booking?"
        );

    if(
        !confirmDelete
    ){
        return;
    }

    try{

        const response =
            await fetch(
                "http://127.0.0.1:8000/bookings/" + id,
                {
                    method:"DELETE"
                }
            );

        const data =
            await response.json();

        alert(
            data.message
        );

        loadBookings();

    }

    catch(error){

        console.log(error);

    }

}

document
.getElementById(
    "searchBooking"
)
.addEventListener(
    "keyup",
    function(){

        const value =
            this.value.toLowerCase();

        const filtered =
            allBookings.filter(
                booking =>

                booking.customer_name
                .toLowerCase()
                .includes(value)

                ||

                booking.room_number
                .toString()
                .includes(value)
            );

        renderBookings(
            filtered
        );

    }
);

document
.getElementById(
    "statusFilter"
)
.addEventListener(
    "change",
    function(){

        const status =
            this.value;

        if(
            status === "all"
        ){

            renderBookings(
                allBookings
            );

            return;
        }

        const filtered =
            allBookings.filter(
                booking =>

                booking.booking_status
                .toLowerCase()
                === status
            );

        renderBookings(
            filtered
        );

    }
);

loadBookings();
function closeModal(){

    document.getElementById(
        "editModal"
    ).style.display = "none";
}

async function updateBooking(){

    try{

        const payload = {

            customer_id:
                selectedBooking.customer_id,

            room_id:
                parseInt(
                    document.getElementById(
                        "editRoomId"
                    ).value
                ),

            check_in:
                document.getElementById(
                    "editCheckIn"
                ).value,

            check_out:
                document.getElementById(
                    "editCheckOut"
                ).value,

            booking_status:
                document.getElementById(
                    "editStatus"
                ).value
        };

        const response =
            await fetch(
                "http://127.0.0.1:8000/bookings/" +
                selectedBooking.booking_id,
                {
                    method:"PUT",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify(
                        payload
                    )
                }
            );

        const data =
            await response.json();

        alert(
            data.message
        );

        closeModal();

        loadBookings();

    }

    catch(error){

        console.log(error);

    }
}