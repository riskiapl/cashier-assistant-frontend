import api from "@lib/axios";

export const authService = {
  async login(payload) {
    const response = await api.post("/auth/login", payload);
    return response.data;
  },

  async register(payload) {
    const response = await api.post("/auth/register", payload);
    return response.data;
  },

  async forgotPassword(email) {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  async resetPassword(token, newPassword) {
    const response = await api.post("/auth/reset-password", {
      token,
      password: newPassword,
    });
    return response.data;
  },

  async refreshToken() {
    const response = await api.post("/auth/refresh");
    return response.data;
  },
};
