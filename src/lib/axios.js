import axios from "axios";
import config from "@config/api";
import { alert } from "./alert";

const api = axios.create({
  baseURL: config.apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      window.location.href = "/auth/login";
    } else if (error.response?.status === 403) {
      alert.error("You don't have permission to access this resource");
    } else if (error.response?.status === 404) {
      alert.error("Resource not found");
    } else if (error.response?.status === 422) {
      alert.error(error.response?.data?.message || "Validation error occurred");
    } else if (error.response?.status >= 500) {
      alert.error("Server error occurred. Please try again later");
    } else {
      alert.error("An unexpected error occurred");
    }
    return Promise.reject(error);
  }
);

export default api;
