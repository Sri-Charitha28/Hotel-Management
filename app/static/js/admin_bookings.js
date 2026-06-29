let allBookings = [];
let filteredBookings = [];
let selectedBooking = null;
const token = localStorage.getItem("token");

if (!token) {

    window.location.replace("/login");

}

let currentPage = 1;
const rowsPerPage = 6;
const bookingDate =
    document.getElementById("bookingDate");

const showHistory =
    document.getElementById("showHistory");


const today = new Date();

bookingDate.value =
    today.toISOString().split("T")[0];

async function loadBookings() {

    try {

        let url =
    "http://127.0.0.1:8000/admin-bookings-data";

if(showHistory.checked){

    url +=
        "?history=true";

}
else{

    url +=
        `?selected_date=${bookingDate.value}`;

}
        const response =
    await fetch(
        url,
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
        allBookings =
            await response.json();

        filteredBookings =
            allBookings;

        currentPage = 1;

        renderBookings(filteredBookings);

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

    const start =
        (currentPage - 1) *
        rowsPerPage;

    const end =
        start +
        rowsPerPage;

    const paginatedBookings =
        bookings.slice(
            start,
            end
        );

    paginatedBookings.forEach(booking => {

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

    renderPagination(bookings);

}

function renderPagination(bookings){

    const totalPages =
        Math.ceil(
            bookings.length /
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

    renderBookings(
        filteredBookings
    );

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

    if(!confirmDelete){

        return;

    }

    try{

        const response =
            await fetch(
                "http://127.0.0.1:8000/bookings/" + id,
                {
    method:"DELETE",

    headers:{
        Authorization:`Bearer ${token}`
    }

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

/* SEARCH */

document
.getElementById(
    "searchBooking"
)
.addEventListener(
    "keyup",
    function(){

        const value =
            this.value.toLowerCase();

        filteredBookings =
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

        currentPage = 1;

        renderBookings(
            filteredBookings
        );

    }
);

/* FILTER */

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

            filteredBookings =
                allBookings;

        }

        else{

            filteredBookings =
                allBookings.filter(
                    booking =>

                    booking.booking_status
                    .toLowerCase()
                    === status
                );

        }

        currentPage = 1;

        renderBookings(
            filteredBookings
        );

    }
);

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

    "Content-Type":"application/json",

    Authorization:`Bearer ${token}`

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
bookingDate.addEventListener(

    "change",

    () => {

        loadBookings();

    }

);
showHistory.addEventListener(

    "change",

    () => {

        if(showHistory.checked){

            bookingDate.disabled = true;

        }
        else{

            bookingDate.disabled = false;

        }

        loadBookings();

    }

);
loadBookings();