import { useNavigate } from "@solidjs/router";
import { useAuth, setAuth, auth } from "@stores/authStore";
import { onMount, createSignal, createEffect } from "solid-js";
import { useTransContext } from "@mbarzda/solid-i18next";
import { alert } from "@lib/alert";
import Navbar from "@components/Navbar";
import { FiHome, FiBook, FiCreditCard } from "solid-icons/fi";
import { memberService } from "@services/memberService";

export default function DashboardLayout(props) {
  const navigate = useNavigate();
  const [t, { changeLanguage, getI18next }] = useTransContext();
  const {
    logout,
    isAuthenticated,
    auth: { user },
  } = useAuth();

  // Language state management moved from Navbar
  const [currentLang, setCurrentLang] = createSignal(getI18next().language);
  const [langDropdownOpen, setLangDropdownOpen] = createSignal(false);

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
  const [menuItems, setMenuItems] = createSignal([]);

  // Language selection function moved from Navbar
  const selectLanguage = (lang) => {
    changeLanguage(lang);
    setCurrentLang(lang);
    setLangDropdownOpen(false);
  };

  // Update menu items when language changes
  createEffect(() => {
    setMenuItems([
      {
        label: t("dashboard.menu.home"),
        href: "/",
        icon: FiHome,
      },
      {
        label: t("dashboard.menu.products"),
        href: "/products",
        icon: FiBook,
      },
      {
        label: t("dashboard.menu.transactions"),
        href: "/transactions",
        icon: FiCreditCard,
      },
    ]);
  });

  const handleLogout = async () => {
    const confirmed = await alert.confirm({
      title: t("dashboard.logout.title"),
      text: t("dashboard.logout.confirmText"),
      confirmText: t("dashboard.logout.confirmButton"),
    });

    if (confirmed) {
      logout();
      alert.success(t("dashboard.logout.successMessage"));
      navigate("/auth/login");
    }
  };

  onMount(async () => {
    // Update currentLang signal to match i18next's current language
    setCurrentLang(getI18next().language);

    if (!isAuthenticated()) {
      navigate("/auth/login", { replace: true });
    }

    try {
      const response = await memberService.getMember(auth.user.id);
      if (response.data) {
        setAuth("user", response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
      }
    } finally {
    }
  });

  return (
    <div
      class="flex overflow-hidden bg-gray-100 p-2 flex-col"
      style={{ height: "100dvh" }}
    >
      {/* Navbar component - pass language state */}
      <Navbar
        user={user}
        logout={handleLogout}
        menuItems={menuItems}
        appName="Cashierly"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        // Language props
        currentLang={currentLang}
        selectLanguage={selectLanguage}
        langDropdownOpen={langDropdownOpen}
        setLangDropdownOpen={setLangDropdownOpen}
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
