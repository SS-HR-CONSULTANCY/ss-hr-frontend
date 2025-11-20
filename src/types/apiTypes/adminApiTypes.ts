import type { Job } from "../entities/job";
import type { User } from "../entities/user";
import type { Review } from "../entities/review";
import type { Package } from "../entities/package";
import type { Payment } from "../entities/payment";
import type { Application } from "../entities/application";
import type { AdminRoleTypes, LimitedRoleType } from "@/utils/zod/commonZod";
import type { ApiBaseResponse } from "../commonTypes";
import type { Address } from "../entities/address";
import type { CareerData } from "../entities/careerData";

// **** job
export type AdminCreateNewJob = Pick<
  Job,
  | "companyName"
  | "designation"
  | "industry"
  | "jobDescription"
  | "benifits"
  | "salary"
  | "skills"
  | "nationality"
  | "vacancy"
>;

export type AdminfetchAllJobsResponse = Pick<
  Job,
  | "_id"
  | "companyName"
  | "designation"
  | "vacancy"
  | "salary"
  | "createdAt"
  | "jobUniqueId"
>;

export type AdminUpdateJobRequest = Pick<
  Job,
  | "companyName"
  | "designation"
  | "industry"
  | "jobDescription"
  | "benifits"
  | "salary"
  | "skills"
  | "nationality"
  | "vacancy"
>;

export type AdminfetchAllUsersResponse = Pick<
  User,
  | "_id"
  | "email"
  | "isBlocked"
  | "isVerified"
  | "profileImage"
  | "fullName"
  | "createdAt"
  | "serialNumber"
>;

export type AdminfetchAllPackagesResponse = Pick<
  Package,
  | "_id"
  | "packageName"
  | "description"
  | "priceIN"
  | "priceUAE"
  | "packageType"
  | "features"
  | "createdAt"
>;

export type AdminfetchAllPaymentsResponse = Pick<
  Payment,
  | "_id"
  | "customerName"
  | "packageName"
  | "totalAmount"
  | "paidAmount"
  | "balanceAmount"
  | "paymentStatus"
>;

export type AdminfetchAllReviewsResponse = Pick<
  Review,
  "_id" | "text" | "username" | "createdAt" | "job"
>;

export type adminFetchApplicationsJobFields = Pick<
  Job,
  "_id" | "designation" | "companyName" | "jobUniqueId"
>;

export type AdminfetchAllApplicationsResponse = {
  _id: Application["_id"];
  updatedAt: Application["updatedAt"];
  status: Application["status"];
  applicationUniqueId: Application["applicationUniqueId"];
} & adminFetchApplicationsJobFields;

export type adminfetchApplicationJobDetailFields = Pick<
  Job,
  | "designation"
  | "companyName"
  | "vacancy"
  | "createdAt"
  | "benifits"
  | "industry"
  | "jobDescription"
  | "nationality"
  | "salary"
  | "skills"
  | "jobUniqueId"
>;
export type adminFetchApplicationUserDetails = Pick<
  User,
  | "fullName"
  | "email"
  | "dob"
  | "gender"
  | "linkedInUsername"
  | "nationality"
  | "phone"
  | "serialNumber"
  | "portfolioUrl"
  | "profileImage"
  | "phoneTwo"
  | "professionalStatus"
  | "resume"
>;
export type AdminFetchApplicationDetailsResponse = ApiBaseResponse &
  Pick<
    Application,
    "createdAt" | "status" | "updatedAt" | "applicationUniqueId"
  > & {
    jobId: adminfetchApplicationJobDetailFields;
    userId: adminFetchApplicationUserDetails;
  };

export type AdminUpdateApplicationStatusRequest = Pick<
  Application,
  "_id" | "status"
>;
export type AdminUpdateApplicationStatusResponse = ApiBaseResponse &
  Pick<Application, "status">;

// ✅ Admin users Response Type
export interface AdminFetchOverviewStatsDataResponse
  extends Record<string, number> {
  totalUsers: number;
  totalPackages: number;
  totalJobsAvailable: number;
  totalCompanies: number;
  totalPostions: number;
  totalApplications: number;
}

// ✅ Admin users Response Type
export interface AdminFetchUserReportStatsDataResponse
  extends Record<string, number> {
  totalUsers: number;
  newUsers: number;
  oldUsers: number;
  jobApplications: number;
  packageUsedUsers: number;
}

// ✅ Admin Applications Response Type
export interface AdminFetchApplicationsReportStatsDataResponse
  extends Record<string, number> {
  totalApplications: number;
  successfulPlacements: number;
}

// ✅ Admin Revenue Response Type
export interface AdminFetchRevenueReportStatsDataResponse
  extends Record<string, number> {
  totalRevenue: number;
  packageRevenue: number;
  hiringRevenue: number;
}

// ✅ Admin overview page graph data Response Type
export interface AdminFetchOverviewGraphsDataResponse {
  usersGragphData: Array<{
    date: string;
    newUsers: number;
    oldUsers: number;
  }>;
  applicationsGraphData: Array<{
    date: string;
    users: number;
    applications: number;
  }>;
}

// ✅ Admin report page user graph data Response Type
export interface AdminFetchReportUserswGraphsDataResponse {
  usersRadialGragphData: Array<{
    day: string;
    count: number;
  }>;
  usersLineGraphData: Array<{
    date: string;
    totalUsers: number;
    oldUsers: number;
    newUsers: number;
    jobApplicants: number;
    packageUsedUsers: number;
  }>;
}

// ✅ Admin report page applications graph data Response Type
export interface AdminFetchReportApplicationsGraphsDataResponse {
  applicationRadialGragphData: Array<{
    day: string;
    count: number;
  }>;
  applicationsLineGraphData: Array<{
    date: string;
    totalApplicants: number;
    successfulPlacements: number;
  }>;
}

// ✅ Admin report page payment and revenue graph data Response Type
export interface AdminFetchReportPaymentsGraphsDataResponse {
  paymentsRadialGragphData: Array<{
    day: string;
    count: number;
  }>;
  revenueLineGraphData: Array<{
    date: string;
    totalRevenue: number;
    packageRevenue: number;
    hiringRevenue: number;
  }>;
}

// ✅ Admin report page report table Response Type
export interface AdminFetchReportTableDataResponse {
  date: string;
  jobApplications: number;
  packagesTaken: number;
  revenueFromJobApplications: number;
  revenueFromPackages: number;
  totalRevenue: number;
}

// Create new admin api request
export interface CreateAdminRequest
  extends Pick<User, "fullName" | "email" | "phone" | "profileImage"> {
  password: string;
  role: LimitedRoleType;
  createrRole: AdminRoleTypes;
}
// Create new admin api response
export type CreateAdminResponse = Pick<
  User,
  | "_id"
  | "fullName"
  | "email"
  | "phone"
  | "profileImage"
  | "role"
  | "isBlocked"
  | "createdAt"
>;

// Fetch all admins
export type AdminFetchAllAdminsResponse = Pick<
  User,
  | "_id"
  | "fullName"
  | "email"
  | "phone"
  | "profileImage"
  | "role"
  | "isBlocked"
  | "createdAt"
>;

// Update admin info
export type UpdateAdminRequest = Pick<
  User,
  "_id" | "fullName" | "email" | "isBlocked" | "profileImage" | "role"
>;
export type UpdateAdminResponse = Pick<
  User,
  "_id" | "fullName" | "email" | "isBlocked" | "profileImage" | "role"
>;

// Delete admin
export type DeleteAdminRequest = Pick<User, "_id">;

export interface AdminfetchAllTestimonialsResponse {
  _id: string;
  clientName: string;
  clientPhoto: string;
  designation: string;
  testimonial: string;
  isVisible: boolean;
  createdAt: string;
}

export type AdminfetchUserDetailFields = Pick<
  User,
  | "createdAt"
  | "dob"
  | "email"
  | "fullName"
  | "gender"
  | "isBlocked"
  | "isVerified"
  | "linkedInUsername"
  | "nationality"
  | "phone"
  | "phoneTwo"
  | "portfolioUrl"
  | "professionalStatus"
  | "profileImage"
  | "resume"
  | "serialNumber"
  | "updatedAt"
>;
export type AdminFetchUserAddressDetails = Pick<
  Address,
  | "addressLine1"
  | "addressLine2"
  | "city"
  | "country"
  | "createdAt"
  | "district"
  | "landmark"
  | "postalCode"
  | "primary"
  | "state"
  | "updatedAt"
>;
export type AdminFetchUserCareerDataDetailsResponse = Pick<
  CareerData,
  | "createdAt"
  | "currentCompany"
  | "currentJobType"
  | "expectedSalary"
  | "currentDesignation"
  | "currentSalary"
  | "experience"
  | "immediateJoiner"
  | "industry"
  | "noticePeriod"
  | "preferredJobTypes"
  | "preferredWorkModes"
  | "updatedAt"
>;
export interface AdminFetchUserDetailsResponse extends ApiBaseResponse {
  userData: AdminfetchUserDetailFields;
  address: AdminFetchUserAddressDetails | null;
  careerData: AdminFetchUserCareerDataDetailsResponse | null;
}
