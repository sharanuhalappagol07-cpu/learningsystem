import axios from 'axios';
import { API_BASE_URL } from './config';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If already refreshing, queue the request
    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Try to refresh token
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);

      // Update authorization header
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      // Notify subscribers
      onTokenRefreshed(accessToken);
      isRefreshing = false;

      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh failed - clear auth and redirect
      isRefreshing = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
