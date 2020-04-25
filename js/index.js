// Accessing the DOM objects

// The two Charts
var ctx = document.getElementById('monthlySales').getContext('2d');
var pieCtx = document.getElementById('deptSales').getContext('2d');

// Yearly Revenue
var yearlyLabel = document.getElementById('yearlyTotal');
yearlyLabel.innerHTML = "$0"

// Monthly Revenue
var newAmount = document.getElementById('itemAmount');
var newMonth = document.getElementById('monthId');

// Dept Options
let hikingRadio = document.getElementById('hiking');
let runningRadio = document.getElementById('running');
let huntingRadio = document.getElementById('hunting');


// Generate Random RGBA Colors for the Graphs
function colorGen() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return "rgba(" + r + ", " + g + ", " + b + ", 1)";
}

// Store the Monthly Sales in a Map data-structure
const monthlySales = new Map();

// Store the Dept Sales in a Map data-structure
const deptSales = new Map([['hiking', { val: 0 }], ['running', { val: 0 }], ['hunting', { val: 0 }]]);

const deptLabels = ['hiking', 'running', 'hunting'];


// Update Monthly Sales
function updateMonthlySale() {
    // Insert month-sale as key-value pair
    monthlySales.set(newMonth.value, Number(newAmount.value));

    // Convert to Array
    let arrSales = Array.from(monthlySales.values());

    // Set BarChart Labels
    monthlySalesChart.data.labels = Array.from(monthlySales.keys());

    // Set BarChart Values and Colors
    monthlySalesChart.data.datasets.forEach(dataset => {
        dataset.data = arrSales;

        // BUG: Color is pushed into the array even if sale entry is invalid
        dataset.backgroundColor.push(colorGen());
    });

    // Calculate Yearly Revenue
    yearlyLabel.innerHTML = "$" + arrSales.reduce((acc, el) => acc + el);

    // Update the Charts
    monthlySalesChart.update();
}

// Update Dept Sales
function updateDeptSale() {
    if (hikingRadio.checked) deptSales.get("hiking").val++;

    if (runningRadio.checked) deptSales.get("running").val++;

    if (huntingRadio.checked) deptSales.get("hunting").val++;

    // Convert to Array
    let arrSales = Array.from(deptSales.values());

    // Map Obj Array to the values
    arrSales = arrSales.map(obj => obj.val);


    // Set PieChart Values and Colors
    deptSalesChart.data.datasets.forEach(dataset => {
        dataset.data = arrSales;
    });

    // Update the Charts
    deptSalesChart.update();
}


// Add Sales Function
function addSale() {

    // Invoke the Helper Functions
    updateMonthlySale();
    updateDeptSale();
}

function resetSales() {
    yearlyLabel.innerHTML = "$0"
    // Reset Monthly Sales
    monthlySales.clear();

    monthlySalesChart.data.labels = [];
    monthlySalesChart.data.datasets.forEach(dataset => {
        dataset.backgroundColor = [];
        dataset.data = [];
    });

    monthlySalesChart.update();

    // Reset Dept Sales
    for (const key of deptSales.keys()) {
        deptSales.get(key).val = 0;
    }

    deptSalesChart.data.datasets.forEach(dataset => {
        dataset.data = [];
    });

    deptSalesChart.update();
}

// Bar
var monthlySalesChart = new Chart(ctx, {
    type: "bar",
    data: {
        labels: [],
        datasets: [
            {
                label: "# of Sales",
                data: [],
                backgroundColor: [],
                borderWidth: 0,
            },
        ],
    },
    options: {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
    },
});

// Pie
var deptSalesChart = new Chart(pieCtx, {
    type: "pie",
    data: {
        labels: deptLabels,
        datasets: [
            {
                label: "# of Sales",
                data: [],
                backgroundColor: [
                    'rgba(238, 184, 104, 1)',
                    'rgba(75, 166, 223, 1)',
                    'rgba(239, 118, 122, 1)',
                ],
                borderWidth: 0,
            },
        ],
    },
    options: {},
});
