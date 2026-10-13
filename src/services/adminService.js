import api from './api';

export const adminService = {
  async getDashboardStats() {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  async getUsers(params = {}) {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  async updateUserStatus(id, status) {
    const res = await api.patch(`/admin/users/${id}/status`, { status });
    return res.data;
  },

  async createScheme(data) {
    const res = await api.post('/admin/schemes', data);
    return res.data;
  },

  async updateScheme(id, data) {
    const res = await api.put(`/admin/schemes/${id}`, data);
    return res.data;
  },

  async deleteScheme(id) {
    const res = await api.delete(`/admin/schemes/${id}`);
    return res.data;
  },

  async updateVerification(id, verificationStatus) {
    const res = await api.put(`/admin/schemes/${id}/verification`, { verificationStatus });
    return res.data;
  },

  async getAuditLogs(params = {}) {
    const res = await api.get('/admin/audit-logs', { params });
    return res.data;
  },
};
