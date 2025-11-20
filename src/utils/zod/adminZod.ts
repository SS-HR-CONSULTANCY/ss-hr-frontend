import z from "zod";
import {
  applicationStatusSchema,
  benifits,
  companyName,
  designation,
  email,
  fullName,
  industry,
  jobDescription,
  nationality,
  password,
  phone,
  phoneTwo,
  skills,
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
  companyName,
  designation,
  industry,
  jobDescription,
  benifits,
  salary: z.number().min(0).max(100000),
  skills,
  nationality,
  vacancy: z.number().min(1).max(100000),
});

export type CreateJobForm = z.infer<typeof createJobSchema>;

// admin create job zod schema
export const updateApplicationStatus = z.object({
  status: applicationStatusSchema,
});

export type UpdateApplicationStatusForm = z.infer<
  typeof updateApplicationStatus
>;
