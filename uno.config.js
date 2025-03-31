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

  // Handle slow css load
  preflights: true,

  // Custom theme
  theme: {
    colors: {
      primary: {
        50: "#f0f0f0", // lighter shade
        100: "#cccccc", // light shade
        200: "#939393", // very light gray
        300: "#666666", // darker gray
        400: "#3d3d3d", // even darker gray
        500: "#262626", // main color
        600: "#1a1a1a", // darker shade for hover effects
        // ... tambahkan warna custom lainnya
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
      "text-white bg-primary-500 hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors",
    "nav-item":
      "flex items-center px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-500 rounded-md mb-3 border-l-4 border-transparent transition-colors duration-150",
    "nav-item-active":
      "flex items-center px-4 py-2 text-white bg-primary-500 rounded-md mb-3 border-l-4 border-primary-500 transition-colors duration-150",
    // ... tambahkan shortcuts lainnya
  },

  // Safelist - selalu include class-class ini
  safelist: ["btn", "btn-primary", "nav-item", "nav-item-active"],
});
