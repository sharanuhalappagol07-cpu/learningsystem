import apiClient from './apiClient';

export const authApi = {
  async register(data) {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  },

  async login(data) {
    const response = await apiClient.post('/api/auth/login', data);
    return response.data;
  },

  async logout() {
    const response = await apiClient.post('/api/auth/logout');
    return response.data;
  },

  async refresh() {
    const response = await apiClient.post('/api/auth/refresh');
    return response.data;
  },
};

export function saveAuthData(data) {
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('user', JSON.stringify(data.user));
}

export function clearAuthData() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
}

export function getStoredUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function getStoredToken() {
  return localStorage.getItem('accessToken');
}
