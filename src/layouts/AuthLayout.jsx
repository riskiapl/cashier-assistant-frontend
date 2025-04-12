import { onMount, createSignal, onCleanup } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "@stores/authStore";
import { useTransContext } from "@mbarzda/solid-i18next";
import LanguageDropdown from "@components/LanguageDropdown";
import { useDarkMode } from "@context/DarkModeContext";

function AuthLayout(props) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [_, { changeLanguage, getI18next }] = useTransContext();
  // Initialize currentLang from the active i18next language
  const [currentLang, setCurrentLang] = createSignal(getI18next().language);
  const [dropdownOpen, setDropdownOpen] = createSignal(false);
  const { isDarkMode } = useDarkMode();
  let dropdownRef; // Change from object to variable for SolidJS refs

  const selectLanguage = (lang) => {
    changeLanguage(lang);
    setCurrentLang(lang);
    setDropdownOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef && !dropdownRef.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  onMount(() => {
    // Update currentLang signal to match i18next's current language
    setCurrentLang(getI18next().language);

    document.addEventListener("mousedown", handleClickOutside);

    const otpRequest = JSON.parse(localStorage.getItem("otpRequest") || "null");
    if (isAuthenticated()) {
      navigate("/", { replace: true });
    } else if (otpRequest) {
      // Check if OTP expiration hasn't passed yet
      const expirationTime = new Date(otpRequest.expired_at).getTime();
      if (expirationTime) {
        navigate("/auth/otp", { replace: true });
      }
    }
  });

  onCleanup(() => {
    document.removeEventListener("mousedown", handleClickOutside);
  });

  return (
    <div
      class={`min-h-screen flex items-center justify-center relative ${
        isDarkMode() ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      {/* Language dropdown in top right - visible on both mobile and desktop */}
      <div class="absolute top-4 right-4 z-10" ref={dropdownRef}>
        <LanguageDropdown
          currentLang={currentLang}
          selectLanguage={selectLanguage}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          isMobile={false}
          ref={dropdownRef}
        />
      </div>

      <div class="max-w-md w-full p-6">{props.children}</div>
    </div>
  );
}

export default AuthLayout;
