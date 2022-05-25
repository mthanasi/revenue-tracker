// two types of charts
var ctx = document.getElementById("monthlySales").getContext("2d");
var pieCtx = document.getElementById("deptSales").getContext("2d");

// yearly revenue
var yearlyLabel = document.getElementById("yearlyTotal");
yearlyLabel.innerHTML = "$0";

// monthly revenue
var newAmount = document.getElementById("itemAmount");
var newMonth = document.getElementById("monthId");

// department options
let hikingRadio = document.getElementById("hiking");
let runningRadio = document.getElementById("running");
let huntingRadio = document.getElementById("hunting");

// generate random RGB colors
function colorGen() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  return "rgba(" + r + ", " + g + ", " + b + ", 1)";
}

// store the monthly sales/department
const monthlySales = new Map();

const deptSales = new Map([
  ["hiking", { val: 0 }],
  ["running", { val: 0 }],
  ["hunting", { val: 0 }],
]);

const deptLabels = ["hiking", "running", "hunting"];

function updateMonthlySale() {
  monthlySales.set(newMonth.value, Number(newAmount.value));

  let arrSales = Array.from(monthlySales.values());

  monthlySalesChart.data.labels = Array.from(monthlySales.keys());

  monthlySalesChart.data.datasets.forEach((dataset) => {
    dataset.data = arrSales;

    // BUG: color is pushed into the array even if sale entry is invalid
    dataset.backgroundColor.push(colorGen());
  });

  // calculate yearly revenue
  yearlyLabel.innerHTML = "$" + arrSales.reduce((acc, el) => acc + el);

  monthlySalesChart.update();
}

function updateDeptSale() {
  if (hikingRadio.checked) deptSales.get("hiking").val++;

  if (runningRadio.checked) deptSales.get("running").val++;

  if (huntingRadio.checked) deptSales.get("hunting").val++;

  // Convert to Array
  let arrSales = Array.from(deptSales.values());

  arrSales = arrSales.map((obj) => obj.val);

  deptSalesChart.data.datasets.forEach((dataset) => {
    dataset.data = arrSales;
  });

  deptSalesChart.update();
}

function addSale() {
  updateMonthlySale();
  updateDeptSale();
}

function resetSales() {
  yearlyLabel.innerHTML = "$0";

  monthlySales.clear();

  monthlySalesChart.data.labels = [];
  monthlySalesChart.data.datasets.forEach((dataset) => {
    dataset.backgroundColor = [];
    dataset.data = [];
  });

  monthlySalesChart.update();

  for (const key of deptSales.keys()) {
    deptSales.get(key).val = 0;
  }

  deptSalesChart.data.datasets.forEach((dataset) => {
    dataset.data = [];
  });

  deptSalesChart.update();
}

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

var deptSalesChart = new Chart(pieCtx, {
  type: "pie",
  data: {
    labels: deptLabels,
    datasets: [
      {
        label: "# of Sales",
        data: [],
        backgroundColor: [
          "rgba(238, 184, 104, 1)",
          "rgba(75, 166, 223, 1)",
          "rgba(239, 118, 122, 1)",
        ],
        borderWidth: 0,
      },
    ],
  },
  options: {},
});
