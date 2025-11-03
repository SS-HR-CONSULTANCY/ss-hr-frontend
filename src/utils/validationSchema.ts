import { z } from "zod";
import type { Gender, Role } from "@/types/entities/user";

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be less than 100 characters")
      .nonempty("Full name is required"),

    email: z
      .string()
      .email("Please enter a valid email address")
      .nonempty("Email is required"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .nonempty("Password is required"),

    confirmPassword: z.string().nonempty("Please confirm your password"),

    role: z.custom<Role>((val) =>
      ["user", "admin", "superAdmin"].includes(val as string)
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const otpSchema = z.object({
  otp: z.string().nonempty("Otp is required"),
  verificationToken: z.string().nonempty("Token required"),
  role: z.custom<Role>((val) =>
    ["user", "admin", "superAdmin"].includes(val as string)
  ),
});


export const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .nonempty("Email is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .nonempty("Password is required"),

  role: z.custom<Role>((val) =>
    ["user", "admin", "superAdmin", "systemAdmin"].includes(val as string)
  ),
});

//**  */ Add job  Form Schema */
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


//** User Profile details zod schema */
const e164Regex = /^\+[1-9]\d{1,14}$/;

export const updateUserInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .nonempty("Email is required"),

  phone: z.string().regex(e164Regex, "Enter a valid phone number (e.g. +971501234567)"),

  phoneTwo: z.string().regex(e164Regex, "Enter a valid phone number (e.g. +971501234567)"),

  gender: z.custom<Gender>((val) => val === "male" || val === "female" || val === "other", {
    message: "Invalid gender",
  }),

  nationality: z.string().min(2, "Enter a valid nationality").max(60),

  linkedInUrl: z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => !val || /^https?:\/\/.+\..+/.test(val),
    { message: "Enter a valid LinkedIn URL (https://...)" }
  ),

portfolioUrl: z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => !val || /^https?:\/\/.+\..+/.test(val),
    { message: "Enter a valid portfolio URL (https://...)" }
  ),

  dob: z.string(),
});




 //* User Address zod schema */
const postalOrPoBoxRegex = /^[0-9]{3,10}$/;
const cityRegex = /^[A-Za-z\s]{2,50}$/;
const countryRegex = /^[A-Za-z\s]{2,60}$/;

export const addressSchema = z
  .object({
    addressLine1: z
      .string()
      .trim()
      .min(3, "Address Line 1 must be at least 3 characters")
      .max(100, "Address Line 1 cannot exceed 100 characters"),

    addressLine2: z
      .string()
      .trim()
      .max(100, "Address Line 2 cannot exceed 100 characters"),

    city: z
      .string()
      .trim()
      .regex(cityRegex, "Enter a valid city name (letters and spaces only)")
      .min(2, "City name must be at least 2 characters")
      .max(50, "City name cannot exceed 50 characters"),

    state: z
      .string()
      .trim()
      .min(2, "State name must be at least 2 characters")
      .max(50, "State name cannot exceed 50 characters"),

    district: z
      .string()
      .trim()
      .min(2, "District name must be at least 2 characters")
      .max(50, "District name cannot exceed 50 characters"),

    country: z
      .string()
      .trim()
      .regex(countryRegex, "Enter a valid country name (letters and spaces only)")
      .min(2, "Country must be at least 2 characters")
      .max(60, "Country cannot exceed 60 characters"),

    postalCode: z
      .string()
      .trim()
      .regex(postalOrPoBoxRegex, "Enter a valid postal code (4–10 digits)"),

    landmark: z
      .string()
      .trim()
      .min(4, "Landmark must be at least 4 characters")
      .max(100, "Landmark cannot exceed 100 characters"),

    primary: z.boolean(),
  });

export type AddressForm = z.infer<typeof addressSchema>;