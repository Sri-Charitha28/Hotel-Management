window.onload = function () {

    // Password field clear cheyyi
    document.getElementById("password").value = "";

    const rememberedEmail =
        localStorage.getItem(
            "rememberedEmail"
        );

    if (rememberedEmail) {

        document.getElementById("email").value =
            rememberedEmail;

        document.getElementById("remember").checked =
            true;
    }
};


document
    .getElementById("loginForm")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const rememberMe =
            document.getElementById("remember").checked;

        const formData = new URLSearchParams();

        formData.append("username", email);
        formData.append("password", password);

        try {

            const response = await fetch(
                "http://127.0.0.1:8000/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                        "application/x-www-form-urlencoded"
                    },
                    body: formData
                }
            );

            const data = await response.json();

            if (data.access_token) {

                // Token Save
                localStorage.setItem(
                    "token",
                    data.access_token
                );

                // User Details Save
                localStorage.setItem(
                    "name",
                    data.name
                );

                localStorage.setItem(
                    "role",
                    data.role
                );
                localStorage.setItem(
                        "user_id",
                         data.user_id
                );
                localStorage.setItem(
                 "customerId",
                 data.customer_id
                );

                // Remember Me Logic
                if (rememberMe) {

                    localStorage.setItem(
                        "rememberedEmail",
                        email
                    );

                } else {

                    localStorage.removeItem(
                        "rememberedEmail"
                    );
                }

                alert("Login Successful");

if (
    data.role === "admin"
) {

    window.location.replace(
        "/dashboard"
    );

}
else {

    window.location.replace(
        "/home"
    );

}

            } else {

                alert(
                    data.message ||
                    "Invalid Credentials"
                );

            }

        } catch (error) {

            console.error(error);

            alert("Login Failed");

        }

    });
const passwordField =
    document.getElementById(
        "password"
    );

const togglePassword =
    document.getElementById(
        "togglePassword"
    );

togglePassword.addEventListener(
    "click",
    function(){

        if(
            passwordField.type ===
            "password"
        ){

            passwordField.type =
                "text";

            this.classList.remove(
                "fa-eye"
            );

            this.classList.add(
                "fa-eye-slash"
            );

        }

        else{

            passwordField.type =
                "password";

            this.classList.remove(
                "fa-eye-slash"
            );

            this.classList.add(
                "fa-eye"
            );

        }

    }
);