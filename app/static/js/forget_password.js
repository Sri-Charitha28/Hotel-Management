document
.getElementById("forgotPasswordForm")
.addEventListener(
    "submit",
    async function(e){

        e.preventDefault();

        const email =
        document
        .getElementById("email")
        .value;

        try{

            const response =
            await fetch(

                `http://127.0.0.1:8000/send-reset-otp?email=${email}`,

                {
                    method:"POST",
                    credentials:"include"
                }

            );

            const data =
            await response.json();

            alert(data.message);

            if(
                data.message ===
                "OTP Sent Successfully"
            ){

                window.location.href =
                "/verify-otp";

            }

        }

        catch(error){

            console.log(error);

            alert(
                "Unable to send OTP."
            );

        }

    }
);