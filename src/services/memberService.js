import api from "@lib/axios";

export const memberService = {
  async getMembers(payload) {
    const response = await api.get(`/members${convertToQueryString(payload)}`);
    return response.data;
  },

  async getMember(id) {
    const response = await api.get(`/members/${id}`);
    return response.data;
  },

  async updateMember(id, payload) {
    const response = await api.put(`/members/${id}`, payload);
    return response.data;
  },

  async deleteMember(id) {
    const response = await api.delete(`/members/${id}`);
    return response.data;
  },
};
