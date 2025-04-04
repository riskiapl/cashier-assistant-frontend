import axios from "axios";
import config from "@config/api";
import { alert } from "./alert";
import { startProgress, completeProgress } from "@components/ProgressBar";
import i18n from "../i18n";

const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true, // Ubah ke false untuk mengatasi masalah CORS pada tahap development
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  timeout: 30000,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    startProgress();
    // Set Accept-Language dynamically on each request
    config.headers["Accept-Language"] =
      localStorage.getItem("language") || "en";

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    completeProgress();
    return Promise.reject(error);
  }
);

// Interceptor untuk handling errors
api.interceptors.response.use(
  (response) => {
    completeProgress();
    return response;
  },
  (error) => {
    completeProgress();
    if (!error.response && error.message === "Network Error") {
      alert.error(i18n.t("axios.networkError"));
      return Promise.reject(error);
    }
    if (error.response?.status === 400) {
      alert.error(error.response?.data?.error || i18n.t("axios.badRequest"));
    } else if (error.response?.status === 401) {
      // Handle unauthorized
      const isLoginPage = window.location.pathname === "/auth/login";
      const errorMsg =
        error.response?.data?.error ||
        (isLoginPage
          ? i18n.t("axios.unauthorized")
          : i18n.t("axios.sessionExpired"));

      if (!isLoginPage) {
        window.location.href = "/auth/login";
      }

      alert.error(errorMsg);
    } else if (error.response?.status === 403) {
      alert.error(error.response?.data?.error || i18n.t("axios.forbidden"));
    } else if (error.response?.status === 404) {
      alert.error(error.response?.data?.error || i18n.t("axios.notFound"));
    } else if (error.response?.status === 409) {
      alert.error(error.response?.data?.error || i18n.t("axios.conflict"));
    } else if (error.response?.status === 422) {
      alert.error(error.response?.data?.error || i18n.t("axios.validation"));
    } else if (error.response?.status >= 500) {
      alert.error(error.response?.data?.error || i18n.t("axios.serverError"));
    } else {
      alert.error(i18n.t("axios.unexpectedError"));
    }
    return Promise.reject(error);
  }
);

export default api;
