import { useNavigate, useLocation } from "@solidjs/router";
import { useAuth } from "../stores/authStore";
import { onMount, createSignal, Show, onCleanup } from "solid-js";
import { alert } from "@lib/alert";
import {
  FiHome,
  FiBook,
  FiCreditCard,
  FiChevronLeft,
  FiChevronRight,
  FiBell,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
} from "solid-icons/fi";

// Import the logo
import logoImage from "@assets/logo_only_color_cashierly.png";

export default function DashboardLayout(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAuthenticated, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = createSignal(true);
  const [dropdownOpen, setDropdownOpen] = createSignal(false);
  let dropdownRef;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen());
  };

  const handleLogout = async () => {
    const confirmed = await alert.confirm({
      title: "Logout",
      text: "Are you sure you want to logout?",
      confirmText: "Yes, logout",
    });

    if (confirmed) {
      logout();
      alert.success("Logged out successfully");
      navigate("/auth/login");
    }
  };

  // Helper function to check if a route is active
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    return path !== "/" && location.pathname.startsWith(path);
  };

  // Handle click outside dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef && !dropdownRef.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  onMount(() => {
    if (!isAuthenticated()) {
      navigate("/auth/login", { replace: true });
    }

    // Add event listener for clicks outside dropdown
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    onCleanup(() => {
      document.removeEventListener("mousedown", handleClickOutside);
    });
  });

  return (
    <div class="h-screen flex overflow-hidden bg-gray-100 p-2">
      {/* Sidebar */}
      <div
        class={`${
          sidebarOpen() ? "w-64" : "w-20"
        } transition-all duration-300 flex flex-col fixed inset-y-4 left-4 bg-white text-gray-800 border border-gray-200 shadow-sm rounded-xl overflow-hidden`}
      >
        {/* Logo */}
        <div class="px-4 py-5 flex items-center justify-center border-b border-gray-200">
          <div class={sidebarOpen() ? "flex items-center" : "hidden"}>
            <img src={logoImage} alt="Cashierly Logo" class="h-8 w-auto mr-2" />
            <h1 class="text-xl font-bold">Cashierly</h1>
          </div>
          <div class={sidebarOpen() ? "hidden" : ""}>
            <img src={logoImage} alt="Cashierly Logo" class="h-8 w-auto" />
          </div>
        </div>

        {/* Navigation items */}
        <nav class="px-2 py-4 flex-grow">
          <a href="/" class={isActive("/") ? "nav-item-active" : "nav-item"}>
            <FiHome class="w-6 h-6 mr-3" />
            <span class={sidebarOpen() ? "" : "hidden"}>Dashboard</span>
          </a>

          <a
            href="/products"
            class={isActive("/products") ? "nav-item-active" : "nav-item"}
          >
            <FiBook class="w-6 h-6 mr-3" />
            <span class={sidebarOpen() ? "" : "hidden"}>Products</span>
          </a>

          <a
            href="/transactions"
            class={isActive("/transactions") ? "nav-item-active" : "nav-item"}
          >
            <FiCreditCard class="w-6 h-6 mr-3" />
            <span class={sidebarOpen() ? "" : "hidden"}>Transactions</span>
          </a>
        </nav>

        {/* Toggle sidebar button */}
        <div class="px-4 py-3 border-t border-gray-200">
          <button
            onClick={toggleSidebar}
            class="w-full flex items-center justify-center text-gray-700 hover:bg-primary-50 hover:text-primary-500 rounded-md p-2 transition-colors duration-150"
          >
            {sidebarOpen() ? (
              <FiChevronLeft class="w-5 h-5" />
            ) : (
              <FiChevronRight class="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div
        class={`flex-1 flex flex-col ${
          sidebarOpen() ? "ml-72" : "ml-28"
        } transition-all duration-300 rounded-xl overflow-hidden`}
      >
        {/* Header */}
        <header>
          <div class="px-4 py-4 flex justify-between items-center">
            <h1 class="text-xl font-semibold text-gray-800">
              <span class="text-primary-200">Pages</span> / Dashboard
            </h1>

            <div class="flex items-center space-x-4">
              {/* Notification button */}
              <button class="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative">
                <FiBell class="w-6 h-6" />
                <span class="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  3
                </span>
              </button>

              {/* User dropdown */}
              <div class="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen())}
                  class="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 py-2 px-3 rounded-md"
                >
                  <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <div class="text-sm text-left">
                    <p class="font-medium">{user?.name || "User"}</p>
                    <p class="text-xs text-gray-500">
                      {user?.role || "Cashier"}
                    </p>
                  </div>
                  <FiChevronDown class="w-4 h-4" />
                </button>

                <Show when={dropdownOpen()}>
                  <div class="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                    <a
                      href="/profile"
                      class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500"
                    >
                      <FiUser class="w-4 h-4 mr-2" />
                      Profile
                    </a>
                    <a
                      href="/settings"
                      class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500"
                    >
                      <FiSettings class="w-4 h-4 mr-2" />
                      Settings
                    </a>
                    <div class="border-t border-gray-100"></div>
                    <button
                      onClick={handleLogout}
                      class="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <FiLogOut class="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </Show>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main class="flex-1 overflow-y-auto p-6">{props.children}</main>
      </div>
    </div>
  );
}
