import api from './api';

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data);
    if (res.data.token) {
      localStorage.setItem('govguide_token', res.data.token);
      localStorage.setItem('govguide_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async login(data) {
    const res = await api.post('/auth/login', data);
    if (res.data.token) {
      localStorage.setItem('govguide_token', res.data.token);
      localStorage.setItem('govguide_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async adminLogin(data) {
    const res = await api.post('/auth/admin/login', data);
    if (res.data.token) {
      localStorage.setItem('govguide_token', res.data.token);
      localStorage.setItem('govguide_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  async getCurrentUser() {
    const res = await api.get('/auth/me');
    return res.data;
  },

  async updateLanguage(language) {
    const res = await api.patch('/user/profile/language', { preferredLanguage: language });
    const user = JSON.parse(localStorage.getItem('govguide_user') || '{}');
    user.preferredLanguage = language;
    localStorage.setItem('govguide_user', JSON.stringify(user));
    return res.data;
  },

  logout() {
    localStorage.removeItem('govguide_token');
    localStorage.removeItem('govguide_user');
  },

  getStoredUser() {
    const u = localStorage.getItem('govguide_user');
    return u ? JSON.parse(u) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('govguide_token');
  },
};
