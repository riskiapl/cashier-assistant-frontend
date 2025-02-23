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
        50: "#f0f9ff",
        100: "#e0f2fe",
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
    "btn-primary": "text-white bg-blue-500 hover:bg-blue-600",
    // ... tambahkan shortcuts lainnya
  },

  // Safelist - selalu include class-class ini
  safelist: ["btn", "btn-primary"],
});
