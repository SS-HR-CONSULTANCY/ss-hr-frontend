import { apiService } from './api';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../types/auth.types';

export const authService = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>('/auth/login', credentials);
  },

  // Register user
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    return apiService.post<AuthResponse>('/auth/register', userData);
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      // Even if API call fails, we still clear local storage
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Verify token
  verifyToken: async (): Promise<AuthResponse> => {
    return apiService.get<AuthResponse>('/auth/verify');
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return apiService.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
    return apiService.post('/auth/reset-password', { token, password });
  },
};