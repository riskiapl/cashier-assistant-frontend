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

  async checkUsername(username) {
    const response = await api.get(`/auth/check-username?username=${username}`);
    return response.data;
  },

  async deletePendingMember(email) {
    const response = await api.delete(
      `/auth/delete-pending-member?email=${email}`
    );
    return response.data;
  },

  async resendOtp(payload) {
    const response = await api.put("/auth/resend-otp", payload);
    return response.data;
  },

  async verifyOtp(payload) {
    const response = await api.post("/auth/verify-otp", payload);
    return response.data;
  },

  async resetPassword(payload) {
    const response = await api.post("/auth/reset-password", payload);
    return response.data;
  },

  async changePassword(payload) {
    const response = await api.put("/auth/change-password", payload);
    return response.data;
  },
};
