let allCustomers = [];

let selectedCustomer = null;
const token = localStorage.getItem("token");

if (!token) {

    window.location.replace("/login");

}

let currentPage = 1;

const rowsPerPage = 5;


/* LOAD CUSTOMERS */

async function loadCustomers() {

    try {

        const response =
    await fetch(
        "http://127.0.0.1:8000/customers",
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    );

if(response.status === 401){

    alert("Session Expired");

    localStorage.clear();

    window.location.replace("/login");

    return;

}

if(response.status === 403){

    alert("Admin Access Only");

    window.location.replace("/home");

    return;

}

        allCustomers =
            await response.json();

        renderCustomers(
            allCustomers
        );

    }

    catch(error){

        console.log(error);

    }

}


/* RENDER CUSTOMERS */

function renderCustomers(customers){

    const table =
        document.getElementById(
            "customersTable"
        );

    table.innerHTML = "";

    const start =
        (currentPage - 1)
        * rowsPerPage;

    const end =
        start + rowsPerPage;

    const paginatedCustomers =
        customers.slice(
            start,
            end
        );

    paginatedCustomers.forEach(customer => {

        table.innerHTML += `

        <tr>

            <td>
                CUST${customer.customer_id}
            </td>

            <td>
                ${customer.name}
            </td>

            <td>
                ${customer.email}
            </td>

            <td>
                ${customer.phone}
            </td>

            <td class="actions">

                <i
                    class="fa-solid fa-pen"
                    onclick="editCustomer(${customer.customer_id})"
                ></i>

                <i
                    class="fa-solid fa-trash"
                    onclick="deleteCustomer(${customer.customer_id})"
                ></i>

            </td>

        </tr>

        `;

    });

    renderPagination(customers);

}


/* PAGINATION */

function renderPagination(customers){

    const totalPages =
        Math.ceil(
            customers.length /
            rowsPerPage
        );

    const pagination =
        document.getElementById(
            "pagination"
        );

    pagination.innerHTML = "";

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

    renderCustomers(
        allCustomers
    );

}


/* SEARCH */

document
.getElementById(
    "searchCustomer"
)
.addEventListener(
    "keyup",
    function(){

        const value =
            this.value.toLowerCase();

        const filtered =
            allCustomers.filter(
                customer =>

                customer.name
                .toLowerCase()
                .includes(value)

                ||

                customer.email
                .toLowerCase()
                .includes(value)

                ||

                customer.phone
                .includes(value)
            );

        currentPage = 1;

        renderCustomers(
            filtered
        );

    }
);


/* ADD CUSTOMER */

function openAddModal(){

    document
    .getElementById(
        "addModal"
    )
    .style.display = "flex";

}

function closeAddModal(){

    document
    .getElementById(
        "addModal"
    )
    .style.display = "none";

}

async function addCustomer(){

    try{

        const payload = {

            name:
                document
                .getElementById(
                    "addName"
                ).value,

            email:
                document
                .getElementById(
                    "addEmail"
                ).value,

            phone:
                document
                .getElementById(
                    "addPhone"
                ).value,

            password:
                document
                .getElementById(
                    "addPassword"
                ).value

        };

        const response =
            await fetch(
                "http://127.0.0.1:8000/customers",
                {
                    method:"POST",

                    headers:{

    "Content-Type":"application/json",

    Authorization:`Bearer ${token}`

},
                    body:
                    JSON.stringify(
                        payload
                    )
                }
            );

        const data =
            await response.json();

        alert(
            data.message
        );

        closeAddModal();

        loadCustomers();

    }

    catch(error){

        console.log(error);

    }

}


/* EDIT CUSTOMER */

function editCustomer(id){

    selectedCustomer =
        allCustomers.find(
            customer =>
            customer.customer_id === id
        );

    document
    .getElementById(
        "editName"
    ).value =
    selectedCustomer.name;

    document
    .getElementById(
        "editEmail"
    ).value =
    selectedCustomer.email;

    document
    .getElementById(
        "editPhone"
    ).value =
    selectedCustomer.phone;

    document
    .getElementById(
        "editModal"
    ).style.display =
    "flex";

}

function closeEditModal(){

    document
    .getElementById(
        "editModal"
    ).style.display =
    "none";

}

async function updateCustomer(){

    try{

        const payload = {

            name:
                document
                .getElementById(
                    "editName"
                ).value,

            email:
                document
                .getElementById(
                    "editEmail"
                ).value,

            phone:
                document
                .getElementById(
                    "editPhone"
                ).value,

            password:"123456"

        };

        const response =
            await fetch(
                "http://127.0.0.1:8000/customers/" +
                selectedCustomer.customer_id,
                {
                    method:"PUT",

                    headers:{

    "Content-Type":"application/json",

    Authorization:`Bearer ${token}`

},

                    body:
                    JSON.stringify(
                        payload
                    )
                }
            );

        const data =
            await response.json();

        alert(
            data.message
        );

        closeEditModal();

        loadCustomers();

    }

    catch(error){

        console.log(error);

    }

}


/* DELETE CUSTOMER */

async function deleteCustomer(id){

    const confirmDelete =
        confirm(
            "Delete this customer?"
        );

    if(
        !confirmDelete
    ){
        return;
    }

    try{

        const response =
            await fetch(
                "http://127.0.0.1:8000/customers/" + id,
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

        loadCustomers();

    }

    catch(error){

        console.log(error);

    }

}


loadCustomers();