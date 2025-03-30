import { useNavigate } from "@solidjs/router";
import { useAuth } from "../stores/authStore";
import { onMount, createSignal } from "solid-js";
import { alert } from "@lib/alert";
import Navbar from "@components/Navbar";
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
      label: "Home",
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
    <div
      class="flex overflow-hidden bg-gray-100 p-2 flex-col"
      style={{ height: "100dvh" }}
    >
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
        class={`flex-1 flex transition-all duration-300 overflow-hidden shadow-md rounded-xl bg-white ${
          sidebarOpen() ? "md:ml-66" : "md:ml-22"
        }`}
      >
        {/* Page content */}
        <main class="flex-1 overflow-y-auto">{props.children}</main>
      </div>
    </div>
  );
}
