import { onMount, createEffect } from "solid-js";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Doughnut } from "solid-chartjs";
import Select from "@components/Select";
import {
  salesData,
  purchasesData,
  incomeData,
  expenseData,
  options,
  filters,
  setFilters,
} from "@stores/homeStore";

const Home = () => {
  // Register ChartJS components on mount
  onMount(() => {
    console.log(filters.timeRange);
    Chart.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      BarElement,
      Title,
      Tooltip,
      Legend,
      ArcElement
    );
  });

  return (
    <div class="bg-white p-6 rounded-lg shadow-sm">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Summary</h1>

        <div class="flex items-center space-x-4">
          <Select
            wrapperClass="w-36"
            label="Time Range"
            options={options().timeRanges}
            initialValue={filters.timeRange}
            onChange={(value) => setFilters("timeRange", value)}
          />

          {filters.timeRange === "Monthly" && (
            <Select
              wrapperClass="w-40"
              label="Month"
              options={options().months}
              initialValue={filters.month}
              onChange={(value) => setFilters("month", value)}
            />
          )}

          <Select
            wrapperClass="w-36"
            label="Year"
            options={options().years}
            initialValue={filters.year}
            onChange={(value) => setFilters("year", Number(value))}
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Sales Chart */}
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h2 class="text-lg font-medium text-gray-800 mb-4">Sales</h2>
          <div class="h-64 w-full">
            <Line
              data={salesData()}
              options={options().lineOptions}
              width={500}
              height={250}
            />
          </div>
        </div>

        {/* Purchases Chart */}
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h2 class="text-lg font-medium text-gray-800 mb-4">Purchases</h2>
          <div class="h-64 w-full">
            <Bar
              data={purchasesData()}
              options={options().lineOptions}
              width={500}
              height={250}
            />
          </div>
        </div>

        {/* Income Chart */}
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h2 class="text-lg font-medium text-gray-800 mb-4">
            Income Distribution
          </h2>
          <div class="h-64 flex items-center justify-center">
            <div style="width: 70%; height: 100%">
              <Doughnut
                data={incomeData()}
                options={options().doughnutOptions}
              />
            </div>
          </div>
        </div>

        {/* Expenses Chart */}
        <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
          <h2 class="text-lg font-medium text-gray-800 mb-4">
            Expense Distribution
          </h2>
          <div class="h-64 flex items-center justify-center">
            <div style="width: 70%; height: 100%">
              <Doughnut
                data={expenseData()}
                options={options().doughnutOptions}
              />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-blue-50 p-4 rounded-lg">
        <p class="text-sm text-blue-700">
          <strong>Note:</strong> This dashboard currently displays sample data.
          Connect to your API to see actual business metrics.
        </p>
      </div>
    </div>
  );
};

export default Home;
