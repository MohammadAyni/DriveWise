// ======================================================
// DRIVEWISE V1
// Complete App JavaScript
// ======================================================


// ======================================================
// STORAGE
// ======================================================

const DRIVE_STORAGE_KEY = "driveWiseDrives";
const FUEL_STORAGE_KEY = "driveWiseFuelRecords";


// ======================================================
// LOAD DATA
// ======================================================

let drives =
    JSON.parse(
        localStorage.getItem(DRIVE_STORAGE_KEY)
    ) || [];


let fuelRecords =
    JSON.parse(
        localStorage.getItem(FUEL_STORAGE_KEY)
    ) || [];


// ======================================================
// OLD DATA MIGRATION
// ======================================================

// Support old DriveWise data
if (
    drives.length === 0 &&
    localStorage.getItem("drives")
) {

    try {

        const oldDrives =
            JSON.parse(
                localStorage.getItem("drives")
            );

        if (Array.isArray(oldDrives)) {

            drives = oldDrives.map(function (drive) {

                return {
                    id:
                        drive.id ||
                        Date.now() +
                        Math.random(),

                    date:
                        drive.date ||
                        new Date().toLocaleString(),

                    miles:
                        Number(drive.miles) || 0,

                    earnings:
                        Number(drive.earnings) || 0
                };

            });

            localStorage.setItem(
                DRIVE_STORAGE_KEY,
                JSON.stringify(drives)
            );

        }

    } catch (error) {

        console.log(
            "Old drive data could not be migrated."
        );

    }

}


// Support old fuel data
if (
    fuelRecords.length === 0 &&
    localStorage.getItem("fuelRecords")
) {

    try {

        const oldFuel =
            JSON.parse(
                localStorage.getItem("fuelRecords")
            );

        if (Array.isArray(oldFuel)) {

            fuelRecords = oldFuel.map(function (record) {

                return {
                    id:
                        record.id ||
                        Date.now() +
                        Math.random(),

                    date:
                        record.date ||
                        new Date().toLocaleString(),

                    fuelCost:
                        Number(
                            record.fuelCost ??
                            record.cost ??
                            record.fuel ??
                            0
                        ),

                    gallons:
                        Number(
                            record.gallons
                        ) || 0,

                    odometer:
                        Number(
                            record.odometer
                        ) || 0
                };

            });

            localStorage.setItem(
                FUEL_STORAGE_KEY,
                JSON.stringify(fuelRecords)
            );

        }

    } catch (error) {

        console.log(
            "Old fuel data could not be migrated."
        );

    }

}


// ======================================================
// SAVE DATA
// ======================================================

function saveData() {

    localStorage.setItem(
        DRIVE_STORAGE_KEY,
        JSON.stringify(drives)
    );

    localStorage.setItem(
        FUEL_STORAGE_KEY,
        JSON.stringify(fuelRecords)
    );

}


// ======================================================
// GET ELEMENTS
// ======================================================

// Drive
const driveForm =
    document.getElementById("driveForm");

const milesInput =
    document.getElementById("miles");

const earningInput =
    document.getElementById("earnings");

const result =
    document.getElementById("result");

const driverList =
    document.getElementById("driverList");

const driveSearch =
    document.getElementById("driveSearch");


// Fuel
const fuelForm =
    document.getElementById("fuelForm");

const fuelCostInput =
    document.getElementById("fuelCost");

const gallonsInput =
    document.getElementById("gallons");

const odometerInput =
    document.getElementById("odometer");

const fuelResult =
    document.getElementById("fuelResult");

const fuelHistory =
    document.getElementById("fuelHistory");


// Statistics
const totalMiles =
    document.getElementById("totalMiles");

const totalEarnings =
    document.getElementById("totalEarnings");

const totalFuel =
    document.getElementById("totalFuel");

const totalNet =
    document.getElementById("totalNet");


// Reports
const reportMiles =
    document.getElementById("reportMiles");

const reportEarnings =
    document.getElementById("reportEarnings");

const reportFuel =
    document.getElementById("reportFuel");

const reportNet =
    document.getElementById("reportNet");

const reportsButton =
    document.getElementById("reportsButton");

const reportsSection =
    document.getElementById("reportsSection");


// Period Reports
const periodMiles =
    document.getElementById("periodMiles");

const periodEarnings =
    document.getElementById("periodEarnings");

const periodFuel =
    document.getElementById("periodFuel");

const periodNet =
    document.getElementById("periodNet");


// Beginner Guide
const newDriverButton =
    document.getElementById("newDriverButton");

const experiencedDriverButton =
    document.getElementById(
        "experiencedDriverButton"
    );

const driverGuide =
    document.getElementById("driverGuide");


// Profile
const profileButton =
    document.getElementById(
        "profileButton"
    );


// ======================================================
// HELPER
// ======================================================

function createId() {

    return (
        Date.now().toString() +
        Math.random()
            .toString(36)
            .substring(2)
    );

}


// ======================================================
// DRIVE SAVE
// ======================================================

if (driveForm) {

    driveForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const miles =
                Number(milesInput.value);

            const earnings =
                Number(earningInput.value);


            if (
                !Number.isFinite(miles) ||
                miles <= 0
            ) {

                alert(
                    "Please enter valid miles."
                );

                return;

            }


            if (
                !Number.isFinite(earnings) ||
                earnings < 0
            ) {

                alert(
                    "Please enter valid earnings."
                );

                return;

            }


            const drive = {

                id: createId(),

                date:
                    new Date().toLocaleString(),

                miles: miles,

                earnings: earnings

            };


            drives.push(drive);

            saveData();

            displayDrives();

            updateStatistics();

            updateReports();

            updatePeriodReport(
                currentPeriod
            );


            const earningsPerMile =
                miles > 0
                    ? earnings / miles
                    : 0;


            if (result) {

                result.textContent =
                    "Miles: " +
                    miles +
                    " | Earnings: $" +
                    earnings.toFixed(2) +
                    " | Earnings/Mile: $" +
                    earningsPerMile.toFixed(2);

            }


            milesInput.value = "";

            earningInput.value = "";

        }
    );

}


// ======================================================
// DISPLAY DRIVES
// ======================================================

function displayDrives() {

    if (!driverList) {
        return;
    }


    driverList.innerHTML = "";


    const searchText =
        driveSearch
            ? driveSearch.value
                .trim()
                .toLowerCase()
            : "";


    const filteredDrives =
        drives.filter(
            function (drive) {

                const text =
                    (
                        String(
                            drive.date || ""
                        ) +
                        " " +
                        String(
                            drive.miles || ""
                        ) +
                        " " +
                        String(
                            drive.earnings || ""
                        )
                    ).toLowerCase();


                return text.includes(
                    searchText
                );

            }
        );


    if (filteredDrives.length === 0) {

        const empty =
            document.createElement("p");

        empty.textContent =
            searchText
                ? "No matching drives found."
                : "No drives saved yet.";

        driverList.appendChild(empty);

        return;

    }


    filteredDrives.forEach(
        function (drive) {

            const item =
                document.createElement("div");

            item.className =
                "drive-item";


            const miles =
                Number(drive.miles) || 0;

            const earnings =
                Number(drive.earnings) || 0;


            const earningsPerMile =
                miles > 0
                    ? earnings / miles
                    : 0;


            const info =
                document.createElement("div");

            info.className =
                "drive-info";


            info.textContent =
                "📅 " +
                (
                    drive.date ||
                    "Older Drive"
                ) +
                " | 🛣️ " +
                miles +
                " miles" +
                " | 💵 $" +
                earnings.toFixed(2) +
                " | 📊 $" +
                earningsPerMile.toFixed(2) +
                "/mile";


            const actions =
                document.createElement("div");

            actions.className =
                "drive-actions";


            // ----------------------------
            // EDIT
            // ----------------------------

            const editButton =
                document.createElement(
                    "button"
                );

            editButton.textContent =
                "✏️ Edit";

            editButton.className =
                "edit-button";


            editButton.addEventListener(
                "click",
                function () {

                    milesInput.value =
                        miles;

                    earningInput.value =
                        earnings;


                    drives =
                        drives.filter(
                            function (item) {

                                return (
                                    item.id !==
                                    drive.id
                                );

                            }
                        );


                    saveData();

                    displayDrives();

                    updateStatistics();

                    updateReports();

                    updatePeriodReport(
                        currentPeriod
                    );


                    window.scrollTo({

                        top: 0,

                        behavior: "smooth"

                    });

                }
            );


            // ----------------------------
            // DELETE
            // ----------------------------

            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.textContent =
                "🗑️ Delete";

            deleteButton.className =
                "delete-button";


            deleteButton.addEventListener(
                "click",
                function () {

                    const confirmed =
                        confirm(
                            "Delete this drive?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    drives =
                        drives.filter(
                            function (item) {

                                return (
                                    item.id !==
                                    drive.id
                                );

                            }
                        );


                    saveData();

                    displayDrives();

                    updateStatistics();

                    updateReports();

                    updatePeriodReport(
                        currentPeriod
                    );

                }
            );


            actions.appendChild(
                editButton
            );

            actions.appendChild(
                deleteButton
            );


            item.appendChild(info);

            item.appendChild(actions);

            driverList.appendChild(item);

        }
    );

}


// ======================================================
// DRIVE SEARCH
// ======================================================

if (driveSearch) {

    driveSearch.addEventListener(
        "input",
        function () {

            displayDrives();

        }
    );

}


// ======================================================
// FUEL SAVE
// ======================================================

if (fuelForm) {

    fuelForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const cost =
                Number(
                    fuelCostInput.value
                );

            const gallons =
                Number(
                    gallonsInput.value
                );

            const odometer =
                Number(
                    odometerInput.value
                );


            if (
                !Number.isFinite(cost) ||
                cost <= 0
            ) {

                alert(
                    "Please enter a valid fuel cost."
                );

                return;

            }


            if (
                !Number.isFinite(gallons) ||
                gallons <= 0
            ) {

                alert(
                    "Please enter valid gallons."
                );

                return;

            }


            if (
                !Number.isFinite(odometer) ||
                odometer < 0
            ) {

                alert(
                    "Please enter a valid odometer."
                );

                return;

            }


            const pricePerGallon =
                cost / gallons;


            const record = {

                id: createId(),

                date:
                    new Date().toLocaleString(),

                fuelCost: cost,

                gallons: gallons,

                odometer: odometer

            };


            fuelRecords.push(record);

            saveData();

            displayFuelHistory();

            updateStatistics();

            updateReports();

            updatePeriodReport(
                currentPeriod
            );


            if (fuelResult) {

                fuelResult.textContent =
                    "Fuel: $" +
                    cost.toFixed(2) +
                    " | " +
                    gallons.toFixed(2) +
                    " gal | $" +
                    pricePerGallon.toFixed(2) +
                    "/gal";

            }


            fuelCostInput.value = "";

            gallonsInput.value = "";

            odometerInput.value = "";

        }
    );

}


// ======================================================
// DISPLAY FUEL HISTORY
// ======================================================

function displayFuelHistory() {

    if (!fuelHistory) {
        return;
    }


    fuelHistory.innerHTML = "";


    if (fuelRecords.length === 0) {

        const empty =
            document.createElement("p");

        empty.textContent =
            "No fuel records yet.";

        fuelHistory.appendChild(empty);

        return;

    }


    fuelRecords.forEach(
        function (record) {

            const item =
                document.createElement("div");

            item.className =
                "fuel-item";


            const cost =
                Number(
                    record.fuelCost ??
                    record.cost ??
                    record.fuel ??
                    0
                );


            const gallons =
                Number(
                    record.gallons
                ) || 0;


            const odometer =
                Number(
                    record.odometer
                ) || 0;


            const pricePerGallon =
                gallons > 0
                    ? cost / gallons
                    : 0;


            const info =
                document.createElement("div");

            info.className =
                "fuel-info";


            info.textContent =
                "📅 " +
                (
                    record.date ||
                    "Older Fuel"
                ) +
                " | ⛽ $" +
                cost.toFixed(2) +
                " | " +
                gallons.toFixed(2) +
                " gal" +
                " | $" +
                pricePerGallon.toFixed(2) +
                "/gal" +
                " | 🚗 Odometer: " +
                odometer;


            const actions =
                document.createElement("div");

            actions.className =
                "fuel-actions";


            // ----------------------------
            // EDIT FUEL
            // ----------------------------

            const editButton =
                document.createElement(
                    "button"
                );

            editButton.textContent =
                "✏️ Edit";


            editButton.className =
                "edit-button";


            editButton.addEventListener(
                "click",
                function () {

                    fuelCostInput.value =
                        cost;

                    gallonsInput.value =
                        gallons;

                    odometerInput.value =
                        odometer;


                    fuelRecords =
                        fuelRecords.filter(
                            function (item) {

                                return (
                                    item.id !==
                                    record.id
                                );

                            }
                        );


                    saveData();

                    displayFuelHistory();

                    updateStatistics();

                    updateReports();

                    updatePeriodReport(
                        currentPeriod
                    );


                    window.scrollTo({

                        top: 0,

                        behavior: "smooth"

                    });

                }
            );


            // ----------------------------
            // DELETE FUEL
            // ----------------------------

            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.textContent =
                "🗑️ Delete";


            deleteButton.className =
                "delete-button";


            deleteButton.addEventListener(
                "click",
                function () {

                    const confirmed =
                        confirm(
                            "Delete this fuel record?"
                        );


                    if (!confirmed) {
                        return;
                    }


                    fuelRecords =
                        fuelRecords.filter(
                            function (item) {

                                return (
                                    item.id !==
                                    record.id
                                );

                            }
                        );


                    saveData();

                    displayFuelHistory();

                    updateStatistics();

                    updateReports();

                    updatePeriodReport(
                        currentPeriod
                    );

                }
            );


            actions.appendChild(
                editButton
            );

            actions.appendChild(
                deleteButton
            );


            item.appendChild(info);

            item.appendChild(actions);

            fuelHistory.appendChild(item);

        }
    );

}


// ======================================================
// TOTAL STATISTICS
// ======================================================

function updateStatistics() {

    let miles = 0;

    let earnings = 0;

    let fuel = 0;


    drives.forEach(
        function (drive) {

            miles +=
                Number(drive.miles) || 0;

            earnings +=
                Number(drive.earnings) || 0;

        }
    );


    fuelRecords.forEach(
        function (record) {

            fuel +=
                Number(
                    record.fuelCost ??
                    record.cost ??
                    record.fuel ??
                    0
                );

        }
    );


    const net =
        earnings - fuel;


    if (totalMiles) {

        totalMiles.textContent =
            miles.toFixed(1);

    }


    if (totalEarnings) {

        totalEarnings.textContent =
            "$" +
            earnings.toFixed(2);

    }


    if (totalFuel) {

        totalFuel.textContent =
            "$" +
            fuel.toFixed(2);

    }


    if (totalNet) {

        totalNet.textContent =
            "$" +
            net.toFixed(2);

    }

}


// ======================================================
// MAIN REPORTS
// ======================================================

function updateReports() {

    let miles = 0;

    let earnings = 0;

    let fuel = 0;


    drives.forEach(
        function (drive) {

            miles +=
                Number(drive.miles) || 0;

            earnings +=
                Number(drive.earnings) || 0;

        }
    );


    fuelRecords.forEach(
        function (record) {

            fuel +=
                Number(
                    record.fuelCost ??
                    record.cost ??
                    record.fuel ??
                    0
                );

        }
    );


    const net =
        earnings - fuel;


    if (reportMiles) {

        reportMiles.textContent =
            miles.toFixed(1);

    }


    if (reportEarnings) {

        reportEarnings.textContent =
            "$" +
            earnings.toFixed(2);

    }


    if (reportFuel) {

        reportFuel.textContent =
            "$" +
            fuel.toFixed(2);

    }


    if (reportNet) {

        reportNet.textContent =
            "$" +
            net.toFixed(2);

    }

}


// ======================================================
// REPORT BUTTON
// ======================================================

if (reportsButton) {

    reportsButton.addEventListener(
        "click",
        function () {

            updateReports();


            if (reportsSection) {

                reportsSection.scrollIntoView({

                    behavior: "smooth"

                });

            }

        }
    );

}


// ======================================================
// PERIOD REPORTS
// ======================================================

let currentPeriod = "today";


// ======================================================
// DATE HELPER
// ======================================================

function getRecordDate(record) {

    if (!record) {
        return null;
    }


    const value =
        record.date ??
        record.createdAt ??
        record.timestamp;


    if (!value) {
        return null;
    }


    const date =
        new Date(value);


    if (
        isNaN(
            date.getTime()
        )
    ) {

        return null;

    }


    return date;

}


// ======================================================
// PERIOD CHECK
// ======================================================

function checkPeriod(
    record,
    period
) {

    const date =
        getRecordDate(record);


    if (!date) {
        return false;
    }


    const now =
        new Date();


    // ALL TIME
    if (period === "all") {

        return true;

    }


    // TODAY
    if (period === "today") {

        return (
            date.getFullYear() ===
                now.getFullYear() &&

            date.getMonth() ===
                now.getMonth() &&

            date.getDate() ===
                now.getDate()
        );

    }


    // THIS WEEK
    if (period === "week") {

        const start =
            new Date(now);


        start.setDate(
            now.getDate() -
            now.getDay()
        );


        start.setHours(
            0,
            0,
            0,
            0
        );


        return (
            date >= start
        );

    }


    // THIS MONTH
    if (period === "month") {

        return (
            date.getFullYear() ===
                now.getFullYear() &&

            date.getMonth() ===
                now.getMonth()
        );

    }


    return false;

}


// ======================================================
// UPDATE PERIOD REPORT
// ======================================================

function updatePeriodReport(
    period
) {

    currentPeriod =
        period;


    let miles = 0;

    let earnings = 0;

    let fuel = 0;


    // ----------------------------
    // DRIVES
    // ----------------------------

    drives.forEach(
        function (drive) {

            if (
                checkPeriod(
                    drive,
                    period
                )
            ) {

                miles +=
                    Number(
                        drive.miles
                    ) || 0;


                earnings +=
                    Number(
                        drive.earnings
                    ) || 0;

            }

        }
    );


    // ----------------------------
    // FUEL
    // ----------------------------

    fuelRecords.forEach(
        function (record) {

            if (
                checkPeriod(
                    record,
                    period
                )
            ) {

                fuel +=
                    Number(
                        record.fuelCost ??
                        record.cost ??
                        record.fuel ??
                        0
                    );

            }

        }
    );


    const net =
        earnings - fuel;


    // ----------------------------
    // UPDATE SCREEN
    // ----------------------------

    if (periodMiles) {

        periodMiles.textContent =
            miles.toFixed(1);

    }


    if (periodEarnings) {

        periodEarnings.textContent =
            "$" +
            earnings.toFixed(2);

    }


    if (periodFuel) {

        periodFuel.textContent =
            "$" +
            fuel.toFixed(2);

    }


    if (periodNet) {

        periodNet.textContent =
            "$" +
            net.toFixed(2);

    }


    // ----------------------------
    // ACTIVE BUTTON
    // ----------------------------

    document
        .querySelectorAll(
            ".period-btn"
        )
        .forEach(
            function (button) {

                button.classList.remove(
                    "active"
                );

            }
        );


    const activeButton =
        document.querySelector(
            '[data-period="' +
            period +
            '"]'
        );


    if (activeButton) {

        activeButton.classList.add(
            "active"
        );

    }

}


// ======================================================
// PERIOD BUTTONS
// ======================================================

document
    .querySelectorAll(
        ".period-btn"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    updatePeriodReport(
                        button.dataset.period
                    );

                }
            );

        }
    );


// ======================================================
// BEGINNER DRIVER GUIDE
// ======================================================

if (newDriverButton) {

    newDriverButton.addEventListener(
        "click",
        function () {

            if (!driverGuide) {
                return;
            }


            driverGuide.innerHTML = `

                <div class="guide-box">

                    <h3>
                        🚗 Beginner Driver Guide
                    </h3>

                    <p>
                        Welcome! Here are some
                        important things to understand
                        before delivery driving.
                    </p>

                    <h4>
                        1. Earnings are not profit
                    </h4>

                    <p>
                        Your earnings are the money
                        you receive from delivery work.
                        Fuel and other vehicle costs
                        reduce your actual profit.
                    </p>

                    <h4>
                        2. Watch $/mile
                    </h4>

                    <p>
                        Always consider how much money
                        an offer pays compared with
                        the miles you need to drive.
                    </p>

                    <h4>
                        3. Track your fuel
                    </h4>

                    <p>
                        Record fuel separately because
                        one tank of fuel can be used
                        across several driving days.
                    </p>

                    <h4>
                        4. Record every drive
                    </h4>

                    <p>
                        Use DriveWise to keep your
                        miles and earnings organized.
                    </p>

                </div>

            `;

        }
    );

}


if (experiencedDriverButton) {

    experiencedDriverButton.addEventListener(
        "click",
        function () {

            if (!driverGuide) {
                return;
            }


            driverGuide.innerHTML = `

                <div class="guide-box">

                    <h3>
                        💪 Experienced Driver
                    </h3>

                    <p>
                        Welcome back! You can use
                        DriveWise to track earnings,
                        mileage, fuel, reports,
                        and driving history.
                    </p>

                </div>

            `;

        }
    );

}


// ======================================================
// PROFILE BUTTON
// ======================================================

if (profileButton) {

    profileButton.addEventListener(
        "click",
        function () {

            alert(
                "👤 Profile\n\n" +
                "Profile and account features " +
                "will be added to DriveWise."
            );

        }
    );

}


// ======================================================
// INITIAL LOAD
// ======================================================

displayDrives();

displayFuelHistory();

updateStatistics();

updateReports();

updatePeriodReport(
    "today"
);

// ============================
// DRIVEWISE CHARTS
// ============================

function drawDriveWiseCharts() {

    const earningsChart =
        document.getElementById("earningsChart");

    const milesChart =
        document.getElementById("milesChart");


    // Check if chart areas exist
    if (!earningsChart || !milesChart) {
        return;
    }


    // Clear old charts
    earningsChart.innerHTML = "";
    milesChart.innerHTML = "";


    // Check drives
    if (!Array.isArray(drives) || drives.length === 0) {

        earningsChart.innerHTML =
            "<p>No drive data yet.</p>";

        milesChart.innerHTML =
            "<p>No drive data yet.</p>";

        return;
    }


    // Use latest 7 drives
    const recentDrives =
        drives.slice(-7);


    // =================================
    // EARNINGS CHART
    // =================================

    let highestEarnings = 0;

    recentDrives.forEach(function (drive) {

        const earnings =
            Number(drive.earnings) || 0;

        if (earnings > highestEarnings) {
            highestEarnings = earnings;
        }

    });


    recentDrives.forEach(function (drive, index) {

        const earnings =
            Number(drive.earnings) || 0;


        const bar =
            document.createElement("div");

        bar.className =
            "chart-bar";


        let height = 10;

        if (highestEarnings > 0) {

            height =
                (earnings / highestEarnings) * 140;

        }


        bar.style.height =
            height + "px";


        const value =
            document.createElement("span");

        value.className =
            "chart-value";

        value.textContent =
            "$" + earnings.toFixed(0);


        const label =
            document.createElement("span");

        label.className =
            "chart-label";

        label.textContent =
            "Drive " + (index + 1);


        bar.appendChild(value);

        bar.appendChild(label);

        earningsChart.appendChild(bar);

    });



    // =================================
    // MILES CHART
    // =================================

    let highestMiles = 0;

    recentDrives.forEach(function (drive) {

        const miles =
            Number(drive.miles) || 0;

        if (miles > highestMiles) {
            highestMiles = miles;
        }

    });


    recentDrives.forEach(function (drive, index) {

        const miles =
            Number(drive.miles) || 0;


        const bar =
            document.createElement("div");

        bar.className =
            "chart-bar";


        let height = 10;

        if (highestMiles > 0) {

            height =
                (miles / highestMiles) * 140;

        }


        bar.style.height =
            height + "px";


        const value =
            document.createElement("span");

        value.className =
            "chart-value";

        value.textContent =
            miles.toFixed(0) + " mi";


        const label =
            document.createElement("span");

        label.className =
            "chart-label";

        label.textContent =
            "Drive " + (index + 1);


        bar.appendChild(value);

        bar.appendChild(label);

        milesChart.appendChild(bar);

    });

}


// =================================
// START CHARTS
// =================================

drawDriveWiseCharts();


// ======================================================
// CONSOLE MESSAGE
// ======================================================

console.log(
    "🚗 DriveWise V1 loaded successfully."
);


// ============================
// AI OFFER ANALYZER
// ============================

const offerForm = document.getElementById("offerForm");
const offerResult = document.getElementById("offerResult");

if (offerForm) {

    offerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const offerAmount =
            Number(document.getElementById("offerAmount").value);

        const offerMiles =
            Number(document.getElementById("offerMiles").value);

        const offerMinutes =
            Number(document.getElementById("offerMinutes").value);

        const offerFuel =
            Number(document.getElementById("offerFuel").value) || 0;


        if (
            offerAmount <= 0 ||
            offerMiles <= 0 ||
            offerMinutes <= 0
        ) {

            offerResult.innerHTML =
                "<p>Please enter valid offer information.</p>";

            return;
        }


        // Earnings per mile
        const earningsPerMile =
            offerAmount / offerMiles;


        // Net income
        const netIncome =
            offerAmount - offerFuel;


        // Net per mile
        const netPerMile =
            netIncome / offerMiles;


        // Earnings per hour
        const hours =
            offerMinutes / 60;

        const earningsPerHour =
            netIncome / hours;


        // Offer rating
        let message = "";
        let icon = "";

        if (netPerMile >= 2) {

            icon = "🟢";
            message = "Strong offer";

        } else if (netPerMile >= 1.5) {

            icon = "🟡";
            message = "Decent offer";

        } else if (netPerMile >= 1) {

            icon = "🟠";
            message = "Low offer";

        } else {

            icon = "🔴";
            message = "Very low offer";
        }


        offerResult.innerHTML = `

            <div class="offer-analysis">

                <h3>
                    ${icon} ${message}
                </h3>

                <p>
                    💵 Offer:
                    <strong>
                        $${offerAmount.toFixed(2)}
                    </strong>
                </p>

                <p>
                    🛣️ Miles:
                    <strong>
                        ${offerMiles.toFixed(1)}
                    </strong>
                </p>

                <p>
                    💰 Net Income:
                    <strong>
                        $${netIncome.toFixed(2)}
                    </strong>
                </p>

                <p>
                    📏 Net / Mile:
                    <strong>
                        $${netPerMile.toFixed(2)}
                    </strong>
                </p>

                <p>
                    ⏱️ Net / Hour:
                    <strong>
                        $${earningsPerHour.toFixed(2)}
                    </strong>
                </p>

            </div>

        `;

    });

}

// ============================
// ROUTE & STOPS
// ============================

const routeButton =
    document.getElementById("routeButton");

const routeSection =
    document.getElementById("routeSection");

const routeForm =
    document.getElementById("routeForm");

const stopsList =
    document.getElementById("stopsList");

const routeTotalMiles =
    document.getElementById("routeTotalMiles");

const routeTotalMinutes =
    document.getElementById("routeTotalMinutes");

const routeResult =
    document.getElementById("routeResult");


// Load saved stops

let routeStops =
    JSON.parse(
        localStorage.getItem("driveWiseRouteStops")
    ) || [];


// ============================
// OPEN ROUTE SECTION
// ============================

if (routeButton) {

    routeButton.addEventListener(
        "click",
        function () {

            if (routeSection) {

                routeSection.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}


// ============================
// ADD STOP
// ============================

if (routeForm) {

    routeForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("stopName")
                    .value
                    .trim();


            const miles =
                Number(
                    document
                        .getElementById("stopMiles")
                        .value
                );


            const minutes =
                Number(
                    document
                        .getElementById("stopMinutes")
                        .value
                );


            if (
                !name ||
                miles <= 0 ||
                minutes <= 0
            ) {

                alert(
                    "Please enter valid stop information."
                );

                return;

            }


            const stop = {

                id: Date.now(),

                name: name,

                miles: miles,

                minutes: minutes,

                date: new Date().toLocaleString()

            };


            routeStops.push(stop);


            localStorage.setItem(
                "driveWiseRouteStops",
                JSON.stringify(routeStops)
            );


            routeForm.reset();


            displayRouteStops();

        }
    );

}


// ============================
// DISPLAY STOPS
// ============================

function displayRouteStops() {

    if (!stopsList) {
        return;
    }


    stopsList.innerHTML = "";


    if (routeStops.length === 0) {

        stopsList.innerHTML =

            "<p>No stops added yet.</p>";

        updateRouteSummary();

        return;

    }


    routeStops.forEach(
        function (stop, index) {

            const item =
                document.createElement("div");


            item.className =
                "route-stop";


            item.innerHTML = `

                <div>

                    <h4>
                        📍 ${stop.name}
                    </h4>

                    <p>
                        🛣️ ${Number(stop.miles).toFixed(1)} miles
                    </p>

                    <p>
                        ⏱️ ${Number(stop.minutes)} minutes
                    </p>

                </div>

                <button
                    type="button"
                    class="delete-stop"
                >
                    🗑️ Delete
                </button>

            `;


            const deleteButton =
                item.querySelector(
                    ".delete-stop"
                );


            deleteButton.addEventListener(
                "click",
                function () {

                    routeStops.splice(
                        index,
                        1
                    );


                    localStorage.setItem(
                        "driveWiseRouteStops",
                        JSON.stringify(routeStops)
                    );


                    displayRouteStops();

                }
            );


            stopsList.appendChild(item);

        }
    );


    updateRouteSummary();

}


// ============================
// ROUTE SUMMARY
// ============================

function updateRouteSummary() {

    let totalMiles = 0;

    let totalMinutes = 0;


    routeStops.forEach(
        function (stop) {

            totalMiles +=
                Number(stop.miles) || 0;


            totalMinutes +=
                Number(stop.minutes) || 0;

        }
    );


    if (routeTotalMiles) {

        routeTotalMiles.textContent =
            totalMiles.toFixed(1) + " mi";

    }


    if (routeTotalMinutes) {

        routeTotalMinutes.textContent =
            totalMinutes + " min";

    }


    if (routeResult) {

        if (routeStops.length > 0) {

            routeResult.innerHTML = `

                <div class="route-success">

                    ✅ Route updated

                    <br>

                    📍 ${routeStops.length} stop(s)

                </div>

            `;

        } else {

            routeResult.innerHTML = "";

        }

    }

}


// ============================
// START ROUTE
// ============================

displayRouteStops();