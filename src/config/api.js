const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  isProduction: import.meta.env.VITE_APP_ENV === "production",
};

export default config;
