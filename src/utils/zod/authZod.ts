import z from "zod";
import {
  confirmPassword,
  email,
  fullName,
  otp,
  password,
  role,
  verificationToken,
} from "./commonZod";

// register form zod schema
export const registerSchema = z
  .object({
    fullName,
    email,
    password,
    confirmPassword,
    role,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
export type RegisterForm = z.infer<typeof registerSchema>;

// otp form zod schema
export const otpSchema = z.object({
  otp,
  verificationToken,
  role,
});
export type OtpForm = z.infer<typeof otpSchema>;

// otp form zod schema
export const loginSchema = z.object({
  email,
  password,
  role,
});
export type LoginForm = z.infer<typeof loginSchema>;

// otp form zod schema
export const emailVerifySchema = z.object({
  email,
});
export type EmailVerifyForm = z.infer<typeof emailVerifySchema>;

// update password form zod schema
export const updatePasswordSchema = z
  .object({
    password,
    confirmPassword,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type UpdatePasswordForm = z.infer<typeof updatePasswordSchema>;
