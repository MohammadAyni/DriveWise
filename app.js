const milesInput = document.getElementById("miles");
const earningInput = document.getElementById("earnings");
const fuelInput = document.getElementById("fuel");

const saveDriveButton = document.getElementById("saveDrive");
const result = document.getElementById("result");
const driverList = document.getElementById("driverList");

const totalMiles = document.getElementById("totalMiles");
const totalEarnings = document.getElementById("totalEarnings");
const totalFuel = document.getElementById("totalFuel");
const totalNet = document.getElementById("totalNet");

let drives = JSON.parse(localStorage.getItem("drives")) || [];

let editingIndex = null;


// ============================
// SAVE / UPDATE DRIVE
// ============================

saveDriveButton.addEventListener("click", function () {

    const miles = Number(milesInput.value);
    const earnings = Number(earningInput.value);
    const fuel = Number(fuelInput.value);


    // Check numbers
    if (miles <= 0 || earnings < 0 || fuel < 0) {
        alert("Please enter valid numbers.");
        return;
    }


    // Calculate net income
    const netIncome = earnings - fuel;


    // ============================
    // UPDATE EXISTING DRIVE
    // ============================

    if (editingIndex !== null) {

        drives[editingIndex] = {
            date: drives[editingIndex].date,
            miles: miles,
            earnings: earnings,
            fuel: fuel,
            netIncome: netIncome
        };

        localStorage.setItem(
            "drives",
            JSON.stringify(drives)
        );

        editingIndex = null;

        saveDriveButton.textContent = "Save Drive";

        result.textContent =
            "Drive updated successfully!";

        displayDrives();
        updateTotalStats();

        milesInput.value = "";
        earningInput.value = "";
        fuelInput.value = "";

        return;
    }


    // ============================
    // CREATE NEW DRIVE
    // ============================

    drives.push({
        date: new Date().toLocaleString(),
        miles: miles,
        earnings: earnings,
        fuel: fuel,
        netIncome: netIncome
    });


    // Save to localStorage
    localStorage.setItem(
        "drives",
        JSON.stringify(drives)
    );


    // Show result
    result.textContent =
        "Miles: " + miles +
        " | Earnings: $" + earnings +
        " | Fuel: $" + fuel +
        " | Net: $" + netIncome.toFixed(2);


    // Update screen
    displayDrives();
    updateTotalStats();


    // Clear inputs
    milesInput.value = "";
    earningInput.value = "";
    fuelInput.value = "";
});


// ============================
// DISPLAY DRIVES
// ============================

function displayDrives() {

    driverList.innerHTML = "";


    drives.forEach(function (drive, index) {

        const item = document.createElement("p");


        // Earnings per mile
        const earningsPerMile =
            drive.miles > 0
                ? drive.earnings / drive.miles
                : 0;


        // Fuel per mile
        const fuelPerMile =
            drive.miles > 0
                ? drive.fuel / drive.miles
                : 0;


        // Net per mile
        const netPerMile =
            drive.miles > 0
                ? drive.netIncome / drive.miles
                : 0;


        // Old drives may not have a date
        const driveDate =
            drive.date || "Older Drive";


        item.textContent =
            "Date: " + driveDate +
            " | Miles: " + drive.miles +
            " | Earnings: $" + drive.earnings +
            " | Fuel: $" + drive.fuel +
            " | Net: $" + drive.netIncome.toFixed(2) +
            " | Earnings/Mile: $" + earningsPerMile.toFixed(2) +
            " | Fuel/Mile: $" + fuelPerMile.toFixed(2) +
            " | Net/Mile: $" + netPerMile.toFixed(2);


        // ============================
        // EDIT BUTTON
        // ============================

        const editButton =
            document.createElement("button");

        editButton.textContent = "Edit";


        editButton.addEventListener("click", function () {

            // Put old values into inputs
            milesInput.value = drive.miles;
            earningInput.value = drive.earnings;
            fuelInput.value = drive.fuel;


            // Remember which drive we are editing
            editingIndex = index;


            // Change button
            saveDriveButton.textContent = "Update Drive";


            // Scroll to inputs
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });


        // ============================
        // DELETE BUTTON
        // ============================

        const deleteButton =
            document.createElement("button");

        deleteButton.textContent = "Delete";


        deleteButton.addEventListener("click", function () {

            drives.splice(index, 1);


            localStorage.setItem(
                "drives",
                JSON.stringify(drives)
            );


            displayDrives();
            updateTotalStats();

        });


        // Add buttons
        item.appendChild(editButton);
        item.appendChild(deleteButton);

        driverList.appendChild(item);
    });
}


// ============================
// TOTAL STATISTICS
// ============================

function updateTotalStats() {

    let miles = 0;
    let earnings = 0;
    let fuel = 0;
    let net = 0;


    drives.forEach(function (drive) {

        miles += Number(drive.miles);
        earnings += Number(drive.earnings);
        fuel += Number(drive.fuel);
        net += Number(drive.netIncome);

    });


    totalMiles.textContent =
        "Total Miles: " + miles;


    totalEarnings.textContent =
        "Total Earnings: $" + earnings.toFixed(2);


    totalFuel.textContent =
        "Total Fuel: $" + fuel.toFixed(2);


    totalNet.textContent =
        "Total Net: $" + net.toFixed(2);
}


// ============================
// LOAD SAVED DRIVES
// ============================

displayDrives();
updateTotalStats();