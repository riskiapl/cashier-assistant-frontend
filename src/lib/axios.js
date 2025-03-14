import axios from "axios";
import config from "@config/api";
import { alert } from "./alert";
import { startProgress, completeProgress } from "@components/ProgressBar";

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
    const auth = localStorage.getItem("auth");
    if (auth) {
      const { token } = JSON.parse(auth);
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
      alert.error(
        "Network error. Please check your internet connection or the API server might be down."
      );
      return Promise.reject(error);
    }
    if (error.response?.status === 400) {
      alert.error(error.response?.data?.error || "Bad request");
    } else if (error.response?.status === 401) {
      // Handle unauthorized
      const isLoginPage = window.location.pathname === "/auth/login";
      const errorMsg =
        error.response?.data?.error ||
        (isLoginPage
          ? "Authentication failed. Please login again."
          : "Your session has expired. Please login again");

      if (!isLoginPage) {
        window.location.href = "/auth/login";
      }

      alert.error(errorMsg);
    } else if (error.response?.status === 403) {
      alert.error("You don't have permission to access this resource");
    } else if (error.response?.status === 404) {
      alert.error(error.response?.data?.error || "Resource not found");
    } else if (error.response?.status === 409) {
      alert.error(
        error.response?.data?.error ||
          "Conflict occurred. The request couldn't be completed due to a conflict with the current state of the resource"
      );
    } else if (error.response?.status === 422) {
      alert.error(error.response?.data?.error || "Validation error occurred");
    } else if (error.response?.status >= 500) {
      alert.error("Server error occurred. Please try again later");
    } else {
      alert.error("An unexpected error occurred");
    }
    return Promise.reject(error);
  }
);

export default api;
