import z from "zod";
import {
  confirmPassword,
  email,
  otp,
  password,
  role,
  verificationToken,
} from "./commonZod";

// register form zod schema
// register form zod schema
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(4, "Full Name must be at least 4 characters")
      .max(50, "Full Name must be at most 50 characters"),
    email,
    password: z
      .string()
      .min(4, "Password must be at least 4 characters")
      .max(50, "Password must be at most 50 characters"),
    confirmPassword: z
      .string()
      .min(4, "Confirm Password must be at least 4 characters")
      .max(50, "Confirm Password must be at most 50 characters"),
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
  password: z
    .string()
    .min(4, "Password must be at least 4 characters")
    .max(50, "Password must be at most 50 characters"),
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
