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
  salary,
  skills,
  vacancy,
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
  salary,
  skills,
  nationality,
  vacancy,
});

export type CreateJobForm = z.infer<typeof createJobSchema>;

// admin create job zod schema
export const updateApplicationStatus = z.object({
  status: applicationStatusSchema,
});

export type UpdateApplicationStatusForm = z.infer<
  typeof updateApplicationStatus
>;
