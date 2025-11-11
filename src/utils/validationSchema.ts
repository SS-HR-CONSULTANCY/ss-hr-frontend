import { z } from "zod";
import type { Gender, Role } from "@/types/entities/user";

export const otpSchema = z.object({
  otp: z.string().nonempty("Otp is required"),
  verificationToken: z.string().nonempty("Token required"),
  role: z.custom<Role>((val) =>
    ["user", "admin", "superAdmin"].includes(val as string)
  ),
});


// login zod schema
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


// admin create job zod schema
export const createJobSchema = z.object({
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


// user profile zod schema
const e164Regex = /^\+[1-9]\d{1,14}$/;
export const userProfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .nonempty("Email is required"),

  phone: z.string().regex(e164Regex, "Enter a valid phone number"),

  phoneTwo: z.string().regex(e164Regex, "Enter a valid phone number"),

  gender: z.custom<Gender>((val) => val === "male" || val === "female" || val === "other", {
    message: "Invalid gender",
  }),

  nationality: z.string().min(2, "Enter a valid nationality").max(60),

  linkedInUsername: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || /^[a-zA-Z0-9-]{5,30}$/.test(val),
      {
        message:
          "Enter a valid LinkedIn username (5–30 letters, numbers, or hyphens).",
      }
    ),

  portfolioUrl: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || /^https?:\/\/[^\s]+\.[^\s]+$/.test(val),
      {
        message: "Enter a valid portfolio URL (must start with http:// or https://).",
      }
    ),
  dob: z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format.",
  })
  .refine((val) => {
    const dob = new Date(val);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const hasNotHadBirthdayThisYear =
      today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate());

    if (hasNotHadBirthdayThisYear) age--;

    return age >= 18;
  }, {
    message: "You must be at least 18 years old",
  })
  .refine((val) => new Date(val) <= new Date(), {
    message: "DOB cannot be in the future",
  }),
  professionalStatus: z
    .string()
    .trim()
    .min(2, "Status must be at least 2 characters long")
    .max(50, "Status must be under 50 characters")
    .refine(
      (val) => /^[A-Za-z ]+$/.test(val),
      { message: "Status can contain only letters and spaces" }
    ),
});

export type ProfileDataForm = z.infer<typeof userProfileSchema>;



// address zod schema
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


// career Data zod schema
export const jobTypeEnum = z.enum(["full-time", "part-time", "contract", "internship", "freelance"]);
export const workModeEnum = z.enum(["onsite", "remote", "hybrid"]);

export const careerDataSchema = z
  .object({
    currentSalary: z
      .coerce.number()
      .min(0, "Current salary must be greater than or equal to 0")
      .max(100000000, "Current salary seems too high")
      .optional(),

    expectedSalary: z
      .coerce.number()
      .min(0, "Expected salary must be greater than or equal to 0")
      .max(100000000, "Expected salary seems too high")
      .optional(),

    immediateJoiner: z.coerce.boolean(),
    noticePeriod: z
      .coerce.number()
      .optional()
      .or(z.nan()) // allow empty if hidden
      .refine((val) => val == null || val >= 0, "Notice period must be positive"),

    experience: z
      .string()
      .optional(),

    currentDesignation: z
      .string()
      .trim()
      .min(2, "Designation must be at least 2 characters")
      .max(100, "Designation too long")
      .optional(),

    currentCompany: z
      .string()
      .trim()
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name too long")
      .optional(),

    industry: z
      .string()
      .trim()
      .min(2, "Industry name must be at least 2 characters")
      .max(100, "Industry name too long")
      .optional(),

    currentJobType: jobTypeEnum.optional(),
    preferredJobTypes: z.array(jobTypeEnum).optional(),
    preferredWorkModes: z.array(workModeEnum).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.immediateJoiner && (data.noticePeriod === undefined || data.noticePeriod === null)) {
      ctx.addIssue({
        code: "custom",
        path: ["noticePeriod"],
        message: "Notice period is required if you are not an immediate joiner",
      });
    }
  });
export type CareerData = z.infer<typeof careerDataSchema>;


export const resumeZodSchema = z.object({
   resume: z
    .instanceof(File)
    .refine((file) => !!file, "Please upload a file")
    .refine(
      (file) => /\.(pdf|doc|docx)$/i.test(file?.name ?? ""),
      "Only PDF, DOC, or DOCX files are allowed"
    )
    .refine(
      (file) => (file?.size ?? 0) <= 5 * 1024 * 1024,
      "File size must be less than 5 MB"
    ),
})
export type ResumeDataForm = z.infer<typeof resumeZodSchema>;