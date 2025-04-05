import { defineConfig, presetIcons, presetAttributify } from "unocss";
import { presetWind3 } from "@unocss/preset-wind3";

export default defineConfig({
  // Presets
  presets: [
    presetWind3(), // Default preset
    presetAttributify(), // Enable attributify mode
    presetIcons({
      // Icon support
      scale: 1.2,
      cdn: "https://esm.sh/",
    }),
  ],

  // Custom theme
  theme: {
    colors: {
      primary: {
        50: "#eff6ff", // lightest blue
        100: "#dbeafe", // lighter blue
        200: "#bfdbfe", // light blue
        300: "#93c5fd", // medium light blue
        400: "#60a5fa", // medium blue
        500: "#3b82f6", // main blue
        600: "#2563eb", // darker blue for hover effects
        700: "#1d4ed8", // dark blue
        800: "#1e40af", // very dark blue
        900: "#1e3a8a", // deepest blue
      },
    },
    // Custom breakpoints
    breakpoints: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
  },

  // Custom shortcuts
  shortcuts: {
    btn: "py-2 px-4 font-semibold rounded-lg shadow-md",
    "btn-primary":
      "text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors",
    "nav-item":
      "flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-500 rounded-md mb-3 border-l-4 border-transparent transition-colors duration-150",
    "nav-item-active":
      "flex items-center px-4 py-2 text-white bg-primary-500 rounded-md mb-3 border-l-4 border-primary-500 transition-colors duration-150",
    // ... tambahkan shortcuts lainnya
  },

  // Safelist - selalu include class-class ini
  safelist: ["btn", "btn-primary", "nav-item", "nav-item-active"],
});
