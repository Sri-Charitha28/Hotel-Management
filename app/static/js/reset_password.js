document
.getElementById(
    "resetPasswordForm"
)
.addEventListener(
    "submit",
    async function(e){

        e.preventDefault();

        const newPassword =
            document
            .getElementById(
                "newPassword"
            )
            .value;

        const confirmPassword =
            document
            .getElementById(
                "confirmPassword"
            )
            .value;

        if(
            newPassword !==
            confirmPassword
        ){

            alert(
                "Passwords do not match."
            );

            return;

        }

        const response =
            await fetch(

                "http://127.0.0.1:8000/reset-password",

                {

                    method:"POST",

                    headers:{

                        "Content-Type":
                        "application/json"

                    },

                    credentials:"include",

                    body:JSON.stringify({

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

        if(
            data.message ===
            "Password Updated Successfully"
        ){

            window.location.href =
                "/password-reset-successful";

        }

    }
);