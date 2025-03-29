import { useNavigate } from "@solidjs/router";
import { useAuth } from "../stores/authStore";
import { onMount, createSignal } from "solid-js";
import { alert } from "@lib/alert";
import Navbar from "../components/Navbar";
import { FiHome, FiBook, FiCreditCard } from "solid-icons/fi";

export default function DashboardLayout(props) {
  const navigate = useNavigate();
  const {
    logout,
    isAuthenticated,
    auth: { user },
  } = useAuth();

  // Initialize sidebarOpen state from localStorage or default to true for larger screens
  const initialSidebarState = () => {
    const savedState = localStorage.getItem("sidebarOpen");
    if (savedState !== null) {
      return savedState === "true";
    }
    return window.innerWidth > 768;
  };

  const [sidebarOpen, setSidebarOpen] = createSignal(initialSidebarState());

  // Define menu items for the navbar
  const menuItems = [
    {
      label: "Dashboard",
      href: "/",
      icon: FiHome,
    },
    {
      label: "Products",
      href: "/products",
      icon: FiBook,
    },
    {
      label: "Transactions",
      href: "/transactions",
      icon: FiCreditCard,
    },
  ];

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

  onMount(() => {
    if (!isAuthenticated()) {
      navigate("/auth/login", { replace: true });
    }
  });

  return (
    <div class="h-screen flex overflow-hidden bg-gray-100 p-2 flex-col">
      {/* Navbar component */}
      <Navbar
        user={user}
        logout={handleLogout}
        menuItems={menuItems}
        appName="Cashierly"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content */}
      <div
        class={`flex-1 flex flex-col transition-all duration-300 rounded-xl overflow-hidden ${
          sidebarOpen() ? "md:ml-64" : "md:ml-20"
        }`}
      >
        {/* Page content */}
        <main class="flex-1 overflow-y-auto px-0 md:px-6 py-0 pt-0 md:pt-0">
          {props.children}
        </main>
      </div>
    </div>
  );
}
