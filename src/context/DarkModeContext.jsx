import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

const DarkModeContext = createContext();

export function DarkModeProvider(props) {
  // Improved initialization from localStorage
  const getDarkModePreference = () => {
    const savedPreference = localStorage.getItem("darkMode");
    // Explicitly check for string value "true" since localStorage stores strings
    if (savedPreference === "true") return true;
    if (savedPreference === "false") return false;
    // If no preference is set, use system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const initialIsDark = getDarkModePreference();

  const [state, setState] = createStore({
    isDarkMode: initialIsDark,
  });

  // Ensure HTML class matches state on mount
  if (typeof document !== "undefined") {
    if (state.isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !state.isDarkMode;
    setState({ isDarkMode: newDarkMode });

    // Store as explicit string to avoid type conversion issues
    localStorage.setItem("darkMode", newDarkMode ? "true" : "false");

    // Update HTML class
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <DarkModeContext.Provider
      value={{ isDarkMode: () => state.isDarkMode, toggleDarkMode }}
    >
      {props.children}
    </DarkModeContext.Provider>
  );
}

// Custom hook to use the dark mode context
export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error("useDarkMode must be used within a DarkModeProvider");
  }
  return context;
}
