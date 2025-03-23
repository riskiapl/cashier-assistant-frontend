import { onMount, createSignal, onCleanup } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useAuth } from "@stores/authStore";
import { useTransContext } from "@mbarzda/solid-i18next";

function AuthLayout(props) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [_, { changeLanguage, getI18next }] = useTransContext();
  // Initialize currentLang from the active i18next language
  const [currentLang, setCurrentLang] = createSignal(getI18next().language);
  const [dropdownOpen, setDropdownOpen] = createSignal(false);
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
    <div class="min-h-screen bg-gray-100 flex items-center justify-center relative">
      <div class="absolute top-4 right-4" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen())}
          class={languageButtonClass}
        >
          {currentLang() === "en" ? (
            <>
              <span class="mr-1 flag-emoji">🇬🇧</span> EN
            </>
          ) : (
            <>
              <span class="mr-1 flag-emoji">🇮🇩</span> ID
            </>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {dropdownOpen() && (
          <div class={dropdownContainerClass}>
            <ul class="py-1">
              <li>
                <button
                  onClick={() => selectLanguage("en")}
                  class={`${languageOptionClass} ${
                    currentLang() === "en" ? "bg-gray-100" : ""
                  }`}
                >
                  <span class="mr-2 flag-emoji">🇬🇧</span> EN
                </button>
              </li>
              <li>
                <button
                  onClick={() => selectLanguage("id")}
                  class={`${languageOptionClass} ${
                    currentLang() === "id" ? "bg-gray-100" : ""
                  }`}
                >
                  <span class="mr-2 flag-emoji">🇮🇩</span> ID
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div class="max-w-md w-full p-6">{props.children}</div>
    </div>
  );
}

export default AuthLayout;

// Style class variables
const languageButtonClass = [
  "bg-white text-gray-800 px-3 py-1",
  "rounded-md shadow-sm hover:bg-gray-100",
  "transition-colors duration-200",
  "text-sm font-medium border border-gray-300",
  "flex items-center space-x-1",
].join(" ");

const dropdownContainerClass = [
  "absolute right-0 mt-1 w-30",
  "bg-white rounded-md shadow-lg z-10",
  "border border-gray-200",
].join(" ");

const languageOptionClass = [
  "px-4 py-2 text-sm text-gray-700",
  "hover:bg-gray-100 w-full text-left",
  "flex items-center",
].join(" ");
