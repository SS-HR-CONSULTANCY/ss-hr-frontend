import type { User } from "../authSliceTypes";
import type { company } from "../entities/company";
import type { Job } from "../entities/job";

export type AdminfetchAllUsersResponse = Pick<User, "_id" | "email" | "isActive" | "isVerified" | "profileImg" | "fullName" | "createdAt">;

export type AdminfetchAllComapniesResponse = Pick<company, "_id"  | "companyLogo" | "companyName" | "email" | "availableJobCount" | "createdAt">;

export type AdminfetchAllJobsResponse = Pick<Job, "companyName" | "jobPost" | "availableCount" | "createdAt">;