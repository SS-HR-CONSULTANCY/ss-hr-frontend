import * as yup from "yup";
import type { Role } from "@/types/entities/user";
import { z } from "zod";

// Register Form Schema
export const registerSchema = yup.object({
  fullName: yup
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .required("Full name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  role: yup
    .mixed<Role>()
    .oneOf(["user", "admin", "superAdmin"] as const)
    .required(),
});

// Otp Form Schema
export const otpSchema = yup.object({
  otp: yup.string().required("Otp is required"),
  verificationToken: yup.string().required("Token required"),
  role: yup.mixed<Role>().oneOf(["user", "admin", "superAdmin"]).required(),
});

// Login Form Schema
export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  role: yup
    .mixed<Role>()
    .oneOf(["user", "admin", "superAdmin", "systemAdmin"])
    .required(),
});

// Add job  Form Schema
export const CreateJobZodSchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be at most 100 characters")
    .trim(),

  designation: z
    .string()
    .min(2, "Designation must be at least 2 characters")
    .max(100, "Designation must be at most 100 characters")
    .trim(),

  industry: z
    .string()
    .min(2, "Industry must be at least 2 characters")
    .max(100, "Industry must be at most 100 characters")
    .trim(),

  jobDescription: z
    .string()
    .min(10, "Job description must be at least 10 characters"),

  benifits: z.string().min(2, "Benefits must be at least 2 characters"),

  salary: z
    .number()
    .int()
    .min(1, "Salary must be at least 1")
    .max(100, "Salary cannot exceed 1000"),

  skills: z.string().min(2, "Skills must be at least 2 characters"),

  nationality: z.string().min(2, "Nationality must be at least 2 characters"),

  vacancy: z
    .number()
    .int()
    .min(1, "Vacancy must be at least 1")
    .max(1000, "Vacancy cannot exceed 1000"),
});

export type CreateJobZodType = z.infer<typeof CreateJobZodSchema>;
