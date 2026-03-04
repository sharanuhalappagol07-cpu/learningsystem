import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, saveAuthData, clearAuthData } from '../lib/auth';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authApi.login(credentials);
          saveAuthData(data);
          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Login failed',
            isLoading: false,
          });
          return false;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const data = await authApi.register(userData);
          saveAuthData(data);
          set({
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } catch (error) {
          console.error('Registration error:', error);
          console.error('Error response:', error.response);
          const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
          set({
            error: errorMessage,
            isLoading: false,
          });
          return false;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error('Logout error:', error);
        }
        clearAuthData();
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setAccessToken: (token) => {
        set({ accessToken: token });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
