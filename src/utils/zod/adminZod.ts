import z from "zod";
import {
  applicationStatusSchema,
  email,
  fullName,
  password,
  phone,
  phoneTwo,
} from "./commonZod";

// admin create new user
export const adminCreateNewUser = z.object({
  fullName,
  email,
  password,
  phone,
  phoneTwo,
});
export type AdminCrateUserForm = z.infer<typeof adminCreateNewUser>;

// admin create job zod schema
export const createJobSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required"),
  designation: z.string().trim().min(1, "Designation is required"),
  jobDescription: z.string().trim().min(1, "Job description is required"),
  benifits: z.string().trim().optional(),
  salary: z.coerce.number().min(0, "Salary must be valid"),
  location: z.string().trim().min(1, "Location is required"),
  vacancy: z.coerce.number().min(1, "Vacancy must be at least 1"),
  currency: z.enum(["Rs", "AED"]).default("Rs"),
});

export type CreateJobForm = z.infer<typeof createJobSchema>;

// admin create job zod schema
export const updateApplicationStatus = z.object({
  status: applicationStatusSchema,
});

export type UpdateApplicationStatusForm = z.infer<
  typeof updateApplicationStatus
>;
