// src/types/auth.types.ts
export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'user' | 'admin' | 'hr';
  isVerified: boolean;
  isActive?: boolean;  // Add this optional property
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}