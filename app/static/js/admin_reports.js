const token = localStorage.getItem("token");

if (!token) {
    window.location.replace("/login");
}
const role = localStorage.getItem("role");

if(role !== "admin"){
    alert("Access Denied");
    window.location.replace("/home");
}
async function loadDashboardStats() {

    try {
const selectedDate =
document.getElementById("reportDate").value;

let url =
"http://127.0.0.1:8000/reports-data";

if(selectedDate){
    url += `?selected_date=${selectedDate}`;
}

const response = await fetch(
    url,
    {
        headers:{
            "Authorization":`Bearer ${token}`
        }
    }
);

const data = await response.json();
            console.log(data);

        document.getElementById(
            "totalRooms"
        ).innerText =
            data.total_rooms;

        document.getElementById(
            "totalBookings"
        ).innerText =
            data.total_bookings;

        document.getElementById(
            "totalCustomers"
        ).innerText =
            data.total_customers;

        document.getElementById(
            "totalRevenue"
        ).innerText =
            "₹" + data.total_revenue;


       
     const chartCanvas =
document.getElementById("roomChart");

Chart.getChart(chartCanvas)?.destroy();

new Chart(chartCanvas,{
    type:"doughnut",
    data:{
        labels:[
            "Available",
            "Occupied"
        ],
        datasets:[
            {
                data:[
                    data.available_rooms,
                    data.occupied_rooms
                ]
            }
        ]
    }
});
const bookingCanvas =
document.getElementById("bookingChart");

Chart.getChart(bookingCanvas)?.destroy();

new Chart(bookingCanvas,{
    type:"pie",
    data:{
        labels:[
            "Booked",
            "Completed",
            "Cancelled"
        ],
        datasets:[
            {
                data:[
                    data.booked,
                    data.completed,
                    data.cancelled
                ]
            }
        ]
    }
});


let rows = "";

data.recent_bookings.forEach(booking=>{

rows += `
<tr>
<td>${booking.booking_id}</td>
<td>${booking.customer_name}</td>
<td>${booking.room_number}</td>
<td>${booking.check_in}</td>
<td>${booking.check_out}</td>
<td>${booking.status}</td>
</tr>
`;

});

document.getElementById(
"recentBookingsTable"
).innerHTML = rows;

    }

    catch(error){

        console.log(error);

    }

}

loadDashboardStats();

async function exportPDF(){

    const startDate =
    document.getElementById("startDate").value;

    const endDate =
    document.getElementById("endDate").value;

    const response = await fetch(
        `http://127.0.0.1:8000/export-report?start_date=${startDate}&end_date=${endDate}`,
        {
            headers:{
                "Authorization":`Bearer ${token}`
            }
        }
    );

    if(!response.ok){
        alert("Export Failed");
        return;
    }

    const blob = await response.blob();

    const downloadUrl =
    window.URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = downloadUrl;

    a.download =
    `Hotel_Report_${startDate}_${endDate}.pdf`;

    document.body.appendChild(a);

    a.click();

    a.remove();

    window.URL.revokeObjectURL(downloadUrl);

}

document
.getElementById("reportDate")
.addEventListener(
"change",
function(){

loadDashboardStats();

}
);
function openExportModal(){
    document.getElementById("exportModal").style.display="flex";
}

function closeExportModal(){
    document.getElementById("exportModal").style.display="none";
}

async function exportExcel(){

    const startDate =
    document.getElementById("startDate").value;

    const endDate =
    document.getElementById("endDate").value;

    const response = await fetch(
        `http://127.0.0.1:8000/export-excel?start_date=${startDate}&end_date=${endDate}`,
        {
            headers:{
                "Authorization":`Bearer ${token}`
            }
        }
    );

    if(!response.ok){
        alert("Export Failed");
        return;
    }

    const blob = await response.blob();

    const downloadUrl =
    window.URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = downloadUrl;

    a.download =
    `Hotel_Report_${startDate}_${endDate}.xlsx`;

    document.body.appendChild(a);

    a.click();

    a.remove();

    window.URL.revokeObjectURL(downloadUrl);

}