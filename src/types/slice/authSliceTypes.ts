import type { User } from "../entities/user";
import type { RoleType } from "@/utils/zod/commonZod";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: RoleType;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface AuthState {
  user: Partial<User> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  otpRemainingTime: number;
  otpTimerIsRunning: boolean;
  profileImageUpdating: boolean;
  isUpdatingPassword: boolean;
}
