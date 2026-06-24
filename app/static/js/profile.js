const customerName =
    localStorage.getItem("name");

const customerEmail =
    localStorage.getItem("customerEmail");

const customerPhone =
    localStorage.getItem("customerPhone");

document.getElementById(
    "customerName"
).innerText =
    customerName || "Customer";

document.getElementById(
    "customerEmail"
).innerText =
    customerEmail || "Not Available";

document.getElementById(
    "customerPhone"
).innerText =
    customerPhone || "Not Available";
document.getElementById(
    "totalBookings"
).innerText = "0";

document.getElementById(
    "completedBookings"
).innerText = "0";

document.getElementById(
    "upcomingBookings"
).innerText = "0";

document.getElementById(
    "totalSpent"
).innerText = "₹0";
async function loadProfileStats() {

    try {

        const customerId =
            localStorage.getItem(
                "customerId"
            );

        const response =
            await fetch(
                `http://127.0.0.1:8000/my-bookings/${customerId}`
            );

        const bookings =
            await response.json();

        document.getElementById(
            "totalBookings"
        ).innerText =
            bookings.length;

        const completed =
            bookings.filter(
                booking =>
                booking.booking_status ===
                "completed"
            );

        document.getElementById(
            "completedBookings"
        ).innerText =
            completed.length;

        const upcoming =
            bookings.filter(
                booking =>
                booking.booking_status ===
                "booked"
            );

        document.getElementById(
            "upcomingBookings"
        ).innerText =
            upcoming.length;

        let totalSpent = 0;

        bookings.forEach(
            booking => {

                if (
                    booking.booking_status !==
                    "cancelled"
                ) {

                    totalSpent +=
                        Number(
                            booking.price
                        );

                }

            }
        );

        document.getElementById(
            "totalSpent"
        ).innerText =
            "₹" + totalSpent;

    }

    catch (error) {

        console.log(error);

    }

}

async function loadCustomerDetails() {

    try {

        const customerId =
            localStorage.getItem(
                "customerId"
            );

        const response =
            await fetch(
                `http://127.0.0.1:8000/customers/${customerId}`
            );

        const customer =
            await response.json();

        document.getElementById(
            "customerName"
        ).innerText =
            customer.name;

        document.getElementById(
            "customerEmail"
        ).innerText =
            customer.email;

        document.getElementById(
            "customerPhone"
        ).innerText =
            customer.phone;

    }

    catch (error) {

        console.log(error);

    }

}
loadCustomerDetails();

loadProfileStats();
function openModal() {

    document.getElementById(
        "editProfileModal"
    ).style.display = "block";

}

function closeModal() {

    document.getElementById(
        "editProfileModal"
    ).style.display = "none";

}
async function updateProfile() {

    const customerId =
        localStorage.getItem(
            "customerId"
        );

    const name =
        document.getElementById(
            "editName"
        ).value;

    const phone =
        document.getElementById(
            "editPhone"
        ).value;

    const email =
        document.getElementById(
            "editEmail"
        ).value;

    try {

        const response =
            await fetch(
                `http://127.0.0.1:8000/customers/${customerId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        phone: phone,

                        email: email,

                        password: "123456"

                    })

                }
            );

        const data =
            await response.json();

        alert(
            data.message
        );

        closeModal();
        loadCustomerDetails();

        loadProfileStats();

     

    }

    catch (error) {

        console.log(error);

        alert(
            "Failed to update profile"
        );

    }

}
function openPasswordModal() {

    document.getElementById(
        "passwordModal"
    ).style.display = "block";

}

function closePasswordModal() {

    document.getElementById(
        "passwordModal"
    ).style.display = "none";

}
async function changePassword() {

    const currentPassword =
        document.getElementById(
            "currentPassword"
        ).value;

    const newPassword =
        document.getElementById(
            "newPassword"
        ).value;

    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        ).value;

    if (
        newPassword !== confirmPassword
    ) {

        alert(
            "Passwords do not match"
        );

        return;
    }

    try {

        const customerId =
            localStorage.getItem(
                "customerId"
            );

        const response =
            await fetch(
                `http://127.0.0.1:8000/customers/change-password/${customerId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        current_password:
                            currentPassword,

                        new_password:
                            newPassword
                    })
                }
            );

        const data =
            await response.json();

        alert(
            data.message
        );

    }

    catch(error){

        console.log(error);

        alert(
            "Failed to update password"
        );

    }

}
function logout() {

    localStorage.clear();

    sessionStorage.clear();

    window.location.href =
        "/login";

}
