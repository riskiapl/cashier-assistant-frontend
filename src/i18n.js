import i18next from "i18next";
import en from "./locales/en.json";
import id from "./locales/id.json";

// Get language preference from localStorage or use default
const savedLanguage = localStorage.getItem("language") || "en";

// Create and initialize an i18next instance
const i18nextInstance = i18next.createInstance();

i18nextInstance.init({
  resources: {
    en: { translation: en },
    id: { translation: id },
  },
  lng: savedLanguage, // Use saved language from localStorage
  fallbackLng: savedLanguage, // Fallback to saved language
  interpolation: {
    escapeValue: false,
  },
});

// Set up event listener for language changes to update localStorage
i18nextInstance.on("languageChanged", (lng) => {
  localStorage.setItem("language", lng);
});

export default i18nextInstance;
