// DashboardLayout.jsx
import { createSignal } from "solid-js";
import { A } from "@solidjs/router";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = createSignal(true);

  return (
    <div class="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        class={`fixed left-0 top-0 z-40 h-screen w-64 transform bg-white shadow-lg transition-transform duration-300 ${
          isSidebarOpen() ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div class="flex h-16 items-center justify-between border-b px-4">
          <h1 class="text-xl font-bold">Cashier Assistant</h1>
          <button onClick={() => setIsSidebarOpen(false)} class="lg:hidden">
            <span class="i-carbon-close text-2xl" />
          </button>
        </div>
        <nav class="p-4">
          <ul class="space-y-2">
            <li>
              <A
                href="/"
                class="flex items-center rounded-lg p-2 hover:bg-gray-100"
              >
                <span class="i-carbon-dashboard mr-2" />
                Dashboard
              </A>
            </li>
            <li>
              <A
                href="/products"
                class="flex items-center rounded-lg p-2 hover:bg-gray-100"
              >
                <span class="i-carbon-box mr-2" />
                Products
              </A>
            </li>
            <li>
              <A
                href="/transactions"
                class="flex items-center rounded-lg p-2 hover:bg-gray-100"
              >
                <span class="i-carbon-receipt mr-2" />
                Transactions
              </A>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        class={`min-h-screen transition-all duration-300 ${
          isSidebarOpen() ? "ml-64" : "ml-0"
        }`}
      >
        <header class="flex h-16 items-center border-b bg-white px-4 shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(true)}
            class={`${isSidebarOpen() ? "hidden" : "block"} lg:hidden`}
          >
            <span class="i-carbon-menu text-2xl" />
          </button>
        </header>
        <div class="p-4">
          <slot />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
