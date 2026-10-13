import api from './api';

export const schemeService = {
  async getSchemes(params = {}) {
    const res = await api.get('/schemes', { params });
    return res.data;
  },

  async getSchemeById(id) {
    const res = await api.get(`/schemes/${id}`);
    return res.data;
  },

  async getRecentSchemes() {
    const res = await api.get('/schemes/recent');
    return res.data;
  },

  async getRecommendedSchemes() {
    const res = await api.get('/schemes/recommended');
    return res.data;
  },

  async getSavedSchemes() {
    const res = await api.get('/user/saved-schemes');
    return res.data;
  },

  async saveScheme(schemeId) {
    const res = await api.post(`/user/saved-schemes/${schemeId}`);
    return res.data;
  },

  async removeSavedScheme(schemeId) {
    const res = await api.delete(`/user/saved-schemes/${schemeId}`);
    return res.data;
  },
};
