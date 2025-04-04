import { Show } from "solid-js";

const Header = ({ title, children }) => {
  return (
    <div class="flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0 sticky z-10 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 top-0 transition-colors duration-300">
      <h1 class="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 md:ml-4 text-align-center">
        {title()}
      </h1>

      {/* Middle section (filters) passed as children */}
      <Show when={children}>{children}</Show>
    </div>
  );
};

export default Header;
