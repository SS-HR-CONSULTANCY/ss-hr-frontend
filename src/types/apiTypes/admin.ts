import type { Job } from "../entities/job";
import type { User } from "../entities/user";
import type { Review } from "../entities/review";
import type { Company } from "../entities/company";
import type { Package } from "../entities/package";
import type { Payment } from "../entities/payment";
import type { Application } from "../entities/application";

export type AdminfetchAllUsersResponse = Pick<User, "_id" | "email" | "isActive" | "isVerified" | "profileImg" | "fullName" | "createdAt">;

export type AdminfetchAllComapniesResponse = Pick<Company, "_id"  | "companyLogo" | "companyName" | "email" | "availableJobCount" | "createdAt">;

export type AdminfetchAllJobsResponse = Pick<Job, "companyName" | "jobPost" | "availableCount" | "createdAt">;

export type AdminfetchAllPackagesResponse = Pick<Package, "packageName" | "description" | "price" | "features" | "createdAt" >;

export type AdminfetchAllPaymentsResponse = Pick<Payment, "transactionId" | "totalAmount" | "discountAmount" | "paymentStatus" | "createdAt" | "username" >;

export type AdminfetchAllReviewsResponse = Pick<Review, "text" | "username" | "createdAt" | "job" >;

export type AdminfetchAllApplicationsResponse = Pick<Application, "username" | "company" | "designation" | "jobId" | "createdAt" | "cvLink" >;