function saveSettings(){

    const settings = {

        hotelName:
            document.getElementById(
                "hotelName"
            ).value,

        hotelEmail:
            document.getElementById(
                "hotelEmail"
            ).value,

        hotelPhone:
            document.getElementById(
                "hotelPhone"
            ).value,

        hotelAddress:
            document.getElementById(
                "hotelAddress"
            ).value,

        checkInTime:
            document.getElementById(
                "checkInTime"
            ).value,

        checkOutTime:
            document.getElementById(
                "checkOutTime"
            ).value,

        gst:
            document.getElementById(
                "gst"
            ).value,

        currency:
            document.getElementById(
                "currency"
            ).value
    };

    localStorage.setItem(
        "hotelSettings",
        JSON.stringify(settings)
    );

    alert(
        "Settings Saved Successfully"
    );

}


function loadSettings(){

    const settings =
        JSON.parse(
            localStorage.getItem(
                "hotelSettings"
            )
        );

    if(!settings){
        return;
    }

    document.getElementById(
        "hotelName"
    ).value =
        settings.hotelName || "";

    document.getElementById(
        "hotelEmail"
    ).value =
        settings.hotelEmail || "";

    document.getElementById(
        "hotelPhone"
    ).value =
        settings.hotelPhone || "";

    document.getElementById(
        "hotelAddress"
    ).value =
        settings.hotelAddress || "";

    document.getElementById(
        "checkInTime"
    ).value =
        settings.checkInTime || "";

    document.getElementById(
        "checkOutTime"
    ).value =
        settings.checkOutTime || "";

    document.getElementById(
        "gst"
    ).value =
        settings.gst || "";

    document.getElementById(
        "currency"
    ).value =
        settings.currency || "INR";
}


function resetSettings(){

    const confirmReset =
        confirm(
            "Reset all settings?"
        );

    if(!confirmReset){
        return;
    }

    document.getElementById(
        "hotelName"
    ).value = "";

    document.getElementById(
        "hotelEmail"
    ).value = "";

    document.getElementById(
        "hotelPhone"
    ).value = "";

    document.getElementById(
        "hotelAddress"
    ).value = "";

    document.getElementById(
        "checkInTime"
    ).value = "";

    document.getElementById(
        "checkOutTime"
    ).value = "";

    document.getElementById(
        "gst"
    ).value = "";

    document.getElementById(
        "currency"
    ).value = "INR";

    localStorage.removeItem(
        "hotelSettings"
    );

    alert(
        "Settings Reset Successfully"
    );
}


loadSettings();