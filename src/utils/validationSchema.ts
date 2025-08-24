import * as yup from 'yup';
import type { Role } from '@/types/entities/user';

// Register Form Schema
export const registerSchema = yup.object({
  fullName: yup
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .required('Full name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup.mixed<Role>().oneOf(["user", "admin", "superAdmin"] as const).required(),
});

// Otp Form Schema
export const otpSchema = yup.object({
  otp: yup
    .string()
    .required('Otp is required'),
  verificationToken: yup.string().required("Token required"),
  role: yup.mixed<Role>().oneOf(["user", "admin", "superAdmin"]).required()
});

// Login Form Schema
export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  role: yup.mixed<Role>().oneOf(["user", "admin", "superAdmin"]).required()
});


// Type definitions
export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;