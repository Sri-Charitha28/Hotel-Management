const userName = localStorage.getItem("name");

if (userName) {
    const welcomeUser =
        document.getElementById("welcomeUser");

    if (welcomeUser) {
        welcomeUser.innerText =
            "Welcome, " + userName;
    }
}
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