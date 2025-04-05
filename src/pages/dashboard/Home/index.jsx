import { onMount, createEffect, createMemo } from "solid-js";
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
import { useDarkMode } from "@context/DarkModeContext";
import { useTransContext } from "@mbarzda/solid-i18next";
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
  const { isDarkMode } = useDarkMode();
  const [t] = useTransContext(); // Get translation function

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

  // Adjust chart options based on dark mode
  const chartOptions = createMemo(() => {
    const darkMode = isDarkMode();
    const textColor = darkMode ? "#e5e7eb" : "#1f2937";
    const gridColor = darkMode
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)";

    return {
      ...options(),
      lineOptions: {
        ...options().lineOptions,
        scales: {
          ...options().lineOptions.scales,
          x: {
            ...options().lineOptions.scales.x,
            grid: { color: gridColor },
            ticks: { color: textColor },
          },
          y: {
            ...options().lineOptions.scales.y,
            grid: { color: gridColor },
            ticks: { color: textColor },
          },
        },
        plugins: {
          ...options().lineOptions.plugins,
          legend: {
            ...options().lineOptions.plugins?.legend,
            labels: {
              color: textColor,
            },
          },
        },
      },
      doughnutOptions: {
        ...options().doughnutOptions,
        plugins: {
          ...options().doughnutOptions.plugins,
          legend: {
            ...options().doughnutOptions.plugins?.legend,
            labels: {
              color: textColor,
            },
          },
        },
      },
    };
  });

  return (
    <div>
      <Header title={() => t("dashboard.home.summary")}>
        <div class="flex flex-row items-start gap-2">
          <Select
            wrapperClass="w-full sm:w-36"
            label={t("dashboard.home.timeRange")}
            initialValue={filters.timeRange}
            onChange={(value) => setFilters("timeRange", value)}
            {...getProps(options().timeRanges)}
          />

          {filters.timeRange?.value === "monthly" && (
            <Select
              wrapperClass="w-full sm:w-40"
              label={t("dashboard.home.month")}
              initialValue={filters.month}
              onChange={(value) => setFilters("month", value)}
              {...getProps(options().months)}
            />
          )}

          <Select
            wrapperClass="w-full sm:w-36"
            label={t("dashboard.home.year")}
            initialValue={filters.year}
            onChange={(value) => setFilters("year", value)}
            {...getProps(options().years)}
          />
        </div>
      </Header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-3">
        {/* Sales Chart */}
        <Card class="p-3 bg-gray-50 dark:bg-gray-700">
          <h2 class="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200 mb-2 sm:mb-4">
            {t("dashboard.home.sales")}
          </h2>
          <div class="h-48 sm:h-64 w-full">
            <Line data={salesData()} options={chartOptions().lineOptions} />
          </div>
        </Card>

        {/* Purchases Chart */}
        <Card class="p-3 bg-gray-50 dark:bg-gray-700">
          <h2 class="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200 mb-2 sm:mb-4">
            {t("dashboard.home.purchases")}
          </h2>
          <div class="h-48 sm:h-64 w-full">
            <Bar data={purchasesData()} options={chartOptions().lineOptions} />
          </div>
        </Card>

        {/* Income Chart */}
        <Card class="p-3 bg-gray-50 dark:bg-gray-700">
          <h2 class="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200 mb-2 sm:mb-4">
            {t("dashboard.home.incomeDistribution")}
          </h2>
          <div class="h-48 sm:h-64 flex items-center justify-center">
            <div style="width: 90%; height: 100%; max-width: 300px;">
              <Doughnut
                data={incomeData()}
                options={chartOptions().doughnutOptions}
              />
            </div>
          </div>
        </Card>

        {/* Expenses Chart */}
        <Card class="p-3 bg-gray-50 dark:bg-gray-700">
          <h2 class="text-base sm:text-lg font-medium text-gray-800 dark:text-gray-200 mb-2 sm:mb-4">
            {t("dashboard.home.expenseDistribution")}
          </h2>
          <div class="h-48 sm:h-64 flex items-center justify-center">
            <div style="width: 90%; height: 100%; max-width: 300px;">
              <Doughnut
                data={expenseData()}
                options={chartOptions().doughnutOptions}
              />
            </div>
          </div>
        </Card>
      </div>

      <div class="p-3">
        <div class="bg-blue-50 dark:bg-blue-900 p-3 sm:p-4 rounded-lg">
          <p class="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
            <strong>{t("dashboard.home.note")}:</strong>{" "}
            {t("dashboard.home.noteContent")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
