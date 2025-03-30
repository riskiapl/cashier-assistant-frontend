import { createStore } from "solid-js/store";
import { createSignal } from "solid-js";

// Options that don't need to be reactive but need to be accessed
const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
const MONTHS = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];
const TIME_RANGES = [
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

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
  labels: MONTHS.map((month) => month.label.slice(0, 3)),
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
  labels: MONTHS.map((month) => month.label.slice(0, 3)),
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
  timeRange: { label: "Monthly", value: "monthly" },
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
