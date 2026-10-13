import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('govguide_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login failure itself
      const isAuthEndpoint = error.config.url?.includes('/api/auth/login');
      if (!isAuthEndpoint && localStorage.getItem('govguide_token')) {
        localStorage.removeItem('govguide_token');
        localStorage.removeItem('govguide_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
