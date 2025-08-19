import type { Job } from "../entities/job";
import type { User } from "../authSliceTypes";
import type { Company } from "../entities/company";
import type { Package } from "../entities/package";

export type AdminfetchAllUsersResponse = Pick<User, "_id" | "email" | "isActive" | "isVerified" | "profileImg" | "fullName" | "createdAt">;

export type AdminfetchAllComapniesResponse = Pick<Company, "_id"  | "companyLogo" | "companyName" | "email" | "availableJobCount" | "createdAt">;

export type AdminfetchAllJobsResponse = Pick<Job, "companyName" | "jobPost" | "availableCount" | "createdAt">;

export type AdminfetchAllPackagesResponse = Pick<Package, "packageName" | "description" | "price" | "features" | "createdAt" >;