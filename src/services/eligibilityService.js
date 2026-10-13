import api from './api';

export const eligibilityService = {
  async checkEligibility(data) {
    const res = await api.post('/eligibility/check', data);
    return res.data;
  },

  async getHistory(params = {}) {
    const res = await api.get('/eligibility/history', { params });
    return res.data;
  },
};
