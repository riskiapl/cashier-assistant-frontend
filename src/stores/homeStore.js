import { createStore } from "solid-js/store";
import { createSignal } from "solid-js";

// Options that don't need to be reactive but need to be accessed
const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const TIME_RANGES = ["Monthly", "Yearly"];

// Chart options - don't need to be reactive
const lineOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
};

const initialSalesData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Sales",
      data: [
        4500, 5200, 6100, 7800, 8400, 9200, 10500, 9700, 8800, 7900, 9500,
        11200,
      ],
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      borderColor: "rgba(53, 162, 235, 1)",
      borderWidth: 1,
    },
  ],
};

const initialPurchasesData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Purchases",
      data: [
        3200, 3800, 4500, 5600, 6100, 6800, 7200, 6900, 6300, 5700, 6500, 7800,
      ],
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
  ],
};

const initialIncomeData = {
  labels: ["Product Sales", "Services", "Other"],
  datasets: [
    {
      data: [12000, 8000, 3000],
      backgroundColor: ["#4ade80", "#60a5fa", "#f97316"],
    },
  ],
};

const initialExpenseData = {
  labels: ["Inventory", "Salary", "Rent", "Utilities"],
  datasets: [
    {
      data: [9000, 6000, 4000, 2000],
      backgroundColor: ["#f87171", "#fbbf24", "#818cf8", "#fb7185"],
    },
  ],
};

const [salesData, setSalesData] = createSignal(initialSalesData);
const [purchasesData, setPurchasesData] = createSignal(initialPurchasesData);
const [incomeData, setIncomeData] = createSignal(initialIncomeData);
const [expenseData, setExpenseData] = createSignal(initialExpenseData);

const [options] = createSignal({
  years: YEARS,
  months: MONTHS,
  timeRanges: TIME_RANGES,
  lineOptions,
  doughnutOptions,
});
const [filters, setFilters] = createStore({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  timeRange: TIME_RANGES[0],
});

export {
  salesData,
  purchasesData,
  incomeData,
  expenseData,
  options,
  filters,
  setFilters,
};
