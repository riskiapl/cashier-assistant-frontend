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
import Header from "@components/Header";
import Select, { getProps } from "@components/Select";
import Card from "@components/Card";
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

  createEffect(() => {
    // Update chart data based on filters
    const year = filters.year;
    const month = filters.month;
    const timeRange = filters.timeRange?.value;

    // Example: Fetch new data based on the selected filters
    // This is where you would typically make an API call to fetch new data
    // For demonstration, we are just logging the selected filters
    console.log(`Fetching data for ${timeRange} of ${month}/${year}`);
  });

  createEffect(() => {
    console.log(options(), "masuk options");
  });

  return (
    <div>
      <Header title="Summary">
        <div class="flex flex-row items-start gap-2">
          <Select
            wrapperClass="w-full sm:w-36"
            label="Time Range"
            initialValue={filters.timeRange}
            onChange={(value) => setFilters("timeRange", value)}
            {...getProps(options().timeRanges)}
          />

          {filters.timeRange?.value === "monthly" && (
            <Select
              wrapperClass="w-full sm:w-40"
              label="Month"
              initialValue={filters.month}
              onChange={(value) => setFilters("month", value)}
              {...getProps(options().months)}
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
      </Header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-3">
        {/* Sales Chart */}
        <Card class="p-3 bg-gray-50">
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
        </Card>

        {/* Purchases Chart */}
        <Card class="p-3 bg-gray-50">
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
        </Card>

        {/* Income Chart */}
        <Card class="p-3 bg-gray-50">
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
        </Card>

        {/* Expenses Chart */}
        <Card class="p-3 bg-gray-50">
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
        </Card>
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
