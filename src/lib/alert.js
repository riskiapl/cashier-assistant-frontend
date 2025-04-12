import Swal from "sweetalert2";

// Helper function to get dark mode state from localStorage instead of using the hook
const getDarkMode = () => {
  try {
    const darkModeFromStorage = localStorage.getItem("darkMode");
    // Return true if darkMode is explicitly "true", otherwise check system preference as fallback
    if (darkModeFromStorage === "true") return true;
    if (darkModeFromStorage === "false") return false;

    // Fallback to check system preference
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  } catch (e) {
    // In case of any errors, return false (light mode)
    return false;
  }
};

const createToast = (color) => {
  const isDark = getDarkMode();

  return Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: isDark ? "#374151" : "#fff", // Dark gray in dark mode, white in light mode
    color: isDark ? "#e5e7eb" : "#1f2937", // Light text in dark mode, dark in light mode
    didOpen: (toast) => {
      toast.querySelector(".swal2-timer-progress-bar").style.backgroundColor =
        color;

      // Add click event to close the toast when clicked
      toast.addEventListener("click", () => {
        Swal.close();
      });
    },
  });
};

export const alert = {
  success: (message) => {
    createToast("#28a745").fire({
      icon: "success",
      title: message,
    });
  },
  error: (message) => {
    createToast("#dc3545").fire({
      icon: "error",
      title: message,
    });
  },
  warning: (message) => {
    createToast("#ffc107").fire({
      icon: "warning",
      title: message,
    });
  },
  info: (message) => {
    createToast("#17a2b8").fire({
      icon: "info",
      title: message,
    });
  },
  confirm: async (options = {}) => {
    const isDark = getDarkMode();

    const result = await Swal.fire({
      title: options.title || "Are you sure?",
      text: options.text || "You won't be able to revert this!",
      icon: options.icon || "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: options.confirmText || "Yes",
      cancelButtonText: options.cancelText || "Cancel",
      background: isDark ? "#374151" : "#fff",
      color: isDark ? "#e5e7eb" : "#1f2937",
    });
    return result.isConfirmed;
  },
};
