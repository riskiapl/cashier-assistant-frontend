import { useNavigate, useLocation } from "@solidjs/router";
import { createSignal, onMount, onCleanup, Show, For } from "solid-js";
import { useTransContext } from "@mbarzda/solid-i18next";
import {
  FiChevronLeft,
  FiChevronRight,
  FiBell,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from "solid-icons/fi";
import LanguageDropdown from "./LanguageDropdown";

// Import the logo
import logoImage from "@assets/logo_only_color_cashierly.png";

export default function Navbar({
  user,
  logout,
  menuItems,
  appName = "Cashierly",
  sidebarOpen,
  setSidebarOpen,
  currentLang,
  selectLanguage,
  langDropdownOpen,
  setLangDropdownOpen,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [t] = useTransContext(); // Only need translation function
  const [dropdownOpen, setDropdownOpen] = createSignal(false);
  const [mobileMenuOpen, setMobileMenuOpen] = createSignal(false);
  let dropdownRef;
  let langDropdownRef;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen());
    // Store sidebar state in localStorage to persist across page refreshes
    localStorage.setItem("sidebarOpen", sidebarOpen());
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen());
  };

  const handleLogout = async () => {
    await logout();
  };

  // Helper function to check if a route is active
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    return path !== "/" && location.pathname.startsWith(path);
  };

  // Function to get current page title based on route
  const getCurrentPageTitle = () => {
    const path = location.pathname;

    // Check for exact match in menuItems first
    const exactMatch = menuItems().find((item) => item.href === path);
    if (exactMatch) return exactMatch.label;

    // Then check for partial match
    const partialMatch = menuItems().find(
      (item) => item.href !== "/" && path.startsWith(item.href)
    );
    if (partialMatch) return partialMatch.label;

    // Default case: capitalize first letter of path segment
    const segment = path.split("/").filter(Boolean)[0];
    return segment
      ? segment.charAt(0).toUpperCase() + segment.slice(1)
      : "Dashboard";
  };

  // Handle click outside dropdowns
  const handleClickOutside = (event) => {
    if (dropdownRef && !dropdownRef.contains(event.target)) {
      setDropdownOpen(false);
    }
    if (langDropdownRef && !langDropdownRef.contains(event.target)) {
      setLangDropdownOpen(false);
    }
  };

  // Close mobile menu when navigating
  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Handle window resize
  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
      localStorage.setItem("sidebarOpen", false);
    }
  };

  onMount(() => {
    // Add event listeners
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    // Initial check for screen size
    handleResize();

    // Clean up the event listeners
    onCleanup(() => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    });
  });

  return (
    <>
      {/* Sidebar - Desktop */}
      <div
        class={`${
          sidebarOpen() ? "w-64" : "w-20"
        } transition-all duration-300 hidden md:flex flex-col fixed inset-y-2 left-2 bg-white text-gray-800 border border-gray-200 shadow-md rounded-xl overflow-hidden`}
      >
        {/* Logo */}
        <div class="px-4 py-5 flex items-center justify-center border-b border-gray-200">
          <div class={sidebarOpen() ? "flex items-center" : "hidden"}>
            <img
              src={logoImage}
              alt={`${appName} Logo`}
              class="h-8 w-auto mr-2"
            />
            <h1 class="text-xl font-bold">{appName}</h1>
          </div>
          <div class={sidebarOpen() ? "hidden" : ""}>
            <img src={logoImage} alt={`${appName} Logo`} class="h-8 w-auto" />
          </div>
        </div>

        {/* Navigation items */}
        <nav class="px-2 py-4 flex-grow">
          <For each={menuItems()}>
            {(item) => (
              <a
                href={item.href}
                class={isActive(item.href) ? "nav-item-active" : "nav-item"}
              >
                <item.icon class="w-6 h-6 mr-3" />
                <span class={sidebarOpen() ? "" : "hidden"}>{item.label}</span>
              </a>
            )}
          </For>
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

      {/* Mobile Sidebar/Overlay */}
      <div
        class={`fixed inset-0 bg-black z-20 md:hidden transition-opacity duration-300 ${
          mobileMenuOpen() ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div
        class={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-30 md:hidden p-2 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen() ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        {/* Mobile Logo */}
        <div class="px-5 py-5 flex items-center border-b border-gray-200">
          <div class="flex items-center">
            <img
              src={logoImage}
              alt={`${appName} Logo`}
              class="h-8 w-auto mr-2"
            />
            <h1 class="text-xl font-bold">{appName}</h1>
          </div>
          <button
            onClick={() => toggleMobileMenu()}
            class="ml-auto p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-transform duration-200 hover:scale-110"
          >
            <FiX class="w-6 h-6 transition-transform duration-300 hover:rotate-90" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav class="px-2 py-4 flex-grow">
          <For each={menuItems()}>
            {(item) => (
              <a
                onClick={() => handleNavigation(item.href)}
                class={`${
                  isActive(item.href) ? "nav-item-active" : "nav-item"
                } w-full flex`}
              >
                <item.icon class="w-6 h-6 mr-3" />
                <span>{item.label}</span>
              </a>
            )}
          </For>
        </nav>
      </div>

      {/* Header */}
      <header
        class={`md:pt-0 ${
          sidebarOpen() ? "md:ml-64" : "md:ml-20"
        } transition-all duration-300`}
      >
        <div class="px-2 py-2 md:px-4 md:py-3 flex justify-between items-center bg-white md:bg-transparent rounded-xl md:rounded-none shadow-md md:shadow-none mb-2 md:mb-0">
          {/* Mobile menu button */}
          <div class="md:hidden">
            <button
              onClick={toggleMobileMenu}
              class="p-2 rounded-md bg-white shadow text-gray-700 hover:bg-gray-100"
            >
              <FiMenu class="w-6 h-6" />
            </button>
          </div>

          <h1 class="text-lg font-semibold text-gray-800 ml-8 md:ml-4 truncate">
            <span class="text-primary-200 hidden md:inline">
              {t("navbar.pages")}
            </span>
            <span class="hidden md:inline">{" / "}</span>
            {getCurrentPageTitle()}
          </h1>

          <div class="flex items-center space-x-2">
            {/* Language dropdown - Desktop */}
            <LanguageDropdown
              currentLang={currentLang}
              selectLanguage={selectLanguage}
              dropdownOpen={langDropdownOpen}
              setDropdownOpen={setLangDropdownOpen}
              isMobile={false}
              ref={langDropdownRef}
            />

            {/* Notification button */}
            <button class="p-1 md:p-2 rounded-md text-gray-600 md:hover:bg-gray-200 relative">
              <FiBell class="w-5 h-5 md:w-6 md:h-6" />
              <span class="absolute top-0 right-0 bg-red-500 text-white rounded-full w-3 h-3 md:w-4 md:h-4 text-xs flex items-center justify-center">
                3
              </span>
            </button>

            {/* User dropdown */}
            <div class="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen())}
                class="flex items-center space-x-1 md:space-x-2 md:hover:bg-gray-200 md:py-2 px-2 md:px-3 rounded-md"
              >
                <div class="w-7 h-7 md:w-8 md:h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs md:text-sm">
                  {(user?.name || user?.username)?.charAt(0) || "U"}
                </div>
                <div class="text-xs md:text-sm text-left hidden md:block">
                  <p class="font-medium">
                    {user?.name || user?.username || "User"}
                  </p>
                  <p class="text-xs text-gray-500">
                    {user?.status || "member"}
                  </p>
                </div>
                <FiChevronDown
                  class={`w-3 h-3 md:w-4 md:h-4 hidden md:block transform transition-transform duration-300 ${
                    dropdownOpen() ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <div
                class={`absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 origin-top-right transform transition-all duration-200 ease-in-out ${
                  dropdownOpen()
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <a
                  href="/profile"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FiUser class="w-4 h-4 mr-2" />
                  {t("navbar.profile")}
                </a>
                <a
                  href="/settings"
                  class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FiSettings class="w-4 h-4 mr-2" />
                  {t("navbar.settings")}
                </a>
                <div class="border-t border-gray-100"></div>
                <button
                  onClick={handleLogout}
                  class="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <FiLogOut class="w-4 h-4 mr-2" />
                  {t("navbar.logout")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
