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
    <div>
      <div class="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0 sticky z-10 bg-white p-3 border-b top-0">
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900 md:ml-4 text-align-center">
          Summary
        </h1>
        <div class="flex flex-row items-start gap-2">
          <Select
            wrapperClass="w-full sm:w-36"
            label="Time Range"
            options={options().timeRanges}
            initialValue={filters.timeRange}
            onChange={(value) => setFilters("timeRange", value)}
          />

          {filters.timeRange === "Monthly" && (
            <Select
              wrapperClass="w-full sm:w-40"
              label="Month"
              options={options().months}
              initialValue={filters.month}
              onChange={(value) => setFilters("month", value)}
            />
          )}

          <Select
            wrapperClass="w-full sm:w-36"
            label="Year"
            options={options().years}
            initialValue={filters.year}
            onChange={(value) => setFilters("year", Number(value))}
          />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-3">
        {/* Sales Chart */}
        <div class="bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm">
          <h2 class="text-base sm:text-lg font-medium text-gray-800 mb-2 sm:mb-4">
            Sales
          </h2>
          <div class="h-48 sm:h-64 w-full">
            <Line
              data={salesData()}
              options={{
                ...options().lineOptions,
                maintainAspectRatio: false,
                responsive: true,
              }}
            />
          </div>
        </div>

        {/* Purchases Chart */}
        <div class="bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm">
          <h2 class="text-base sm:text-lg font-medium text-gray-800 mb-2 sm:mb-4">
            Purchases
          </h2>
          <div class="h-48 sm:h-64 w-full">
            <Bar
              data={purchasesData()}
              options={{
                ...options().lineOptions,
                maintainAspectRatio: false,
                responsive: true,
              }}
            />
          </div>
        </div>

        {/* Income Chart */}
        <div class="bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm">
          <h2 class="text-base sm:text-lg font-medium text-gray-800 mb-2 sm:mb-4">
            Income Distribution
          </h2>
          <div class="h-48 sm:h-64 flex items-center justify-center">
            <div style="width: 90%; height: 100%; max-width: 300px;">
              <Doughnut
                data={incomeData()}
                options={{
                  ...options().doughnutOptions,
                  maintainAspectRatio: false,
                  responsive: true,
                }}
              />
            </div>
          </div>
        </div>

        {/* Expenses Chart */}
        <div class="bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm">
          <h2 class="text-base sm:text-lg font-medium text-gray-800 mb-2 sm:mb-4">
            Expense Distribution
          </h2>
          <div class="h-48 sm:h-64 flex items-center justify-center">
            <div style="width: 90%; height: 100%; max-width: 300px;">
              <Doughnut
                data={expenseData()}
                options={{
                  ...options().doughnutOptions,
                  maintainAspectRatio: false,
                  responsive: true,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div class="p-3">
        <div class="bg-blue-50 p-3 sm:p-4 rounded-lg">
          <p class="text-xs sm:text-sm text-blue-700">
            <strong>Note:</strong> This dashboard currently displays sample
            data. Connect to your API to see actual business metrics.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
