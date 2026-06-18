const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if(password !== confirmPassword){

        alert("Passwords do not match");

        return;
    }

    const customerData = {

        name:
            document.getElementById("name").value,

        phone:
            document.getElementById("phone").value,

        email:
            document.getElementById("email").value,

        password: password
    };

    const response = await fetch(
        "http://127.0.0.1:8000/customers",
        {
            method: "POST",

            headers: {
                "Content-Type":
                "application/json"
            },

            body: JSON.stringify(
                customerData
            )
        }
    );

    const result =
        await response.json();

    alert(result.message);

    window.location.href = "/login";
});