document
.getElementById("verifyOtpForm")
.addEventListener(
    "submit",
    async function(e){

        e.preventDefault();

        const otp =
            document
            .getElementById("otp")
            .value
            .trim();

        if(otp === ""){

            alert("Please enter OTP.");

            return;

        }

        try{

            const response =
                await fetch(

                    `http://127.0.0.1:8000/verify-reset-otp?otp=${otp}`,

                    {

                        method:"POST",

                        credentials:"include"

                    }

                );

            const data =
                await response.json();
                console.log(data);
                alert(JSON.stringify(data));

            if(
                data.message ===
                "OTP Verified"
            ){

                window.location.href =
                    "/reset-password";

            }

        }

        catch(error){

            console.log(error);

            alert("Something went wrong.");

        }

    }
);