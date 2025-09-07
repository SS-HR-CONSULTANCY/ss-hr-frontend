import type { Job } from "../entities/job";
import type { User } from "../entities/user";
import type { Review } from "../entities/review";
import type { Company } from "../entities/company";
import type { Package } from "../entities/package";
import type { Payment } from "../entities/payment";
import type { Application } from "../entities/application";

export type AdminfetchAllUsersResponse = Pick<User, "_id" | "email" | "isBlocked" | "isVerified" | "profileImage" | "fullName" | "createdAt">;

export type AdminfetchAllComapniesResponse = Pick<Company, "_id" | "companyLogo" | "companyName" | "email" | "availableJobCount" | "createdAt">;

export type AdminfetchAllJobsResponse = Pick<Job, "_id" | "companyName" | "designation" | "vacancy" | "createdAt">;

export type AdminfetchAllPackagesResponse = Pick<Package, "_id" | "packageName" | "description" | "price" | "features" | "createdAt">;

export type AdminfetchAllPaymentsResponse = Pick<Payment, "_id" | "transactionId" | "totalAmount" | "discountAmount" | "paymentStatus" | "createdAt" | "username">;

export type AdminfetchAllReviewsResponse = Pick<Review, "_id" | "text" | "username" | "createdAt" | "job">;

export type AdminfetchAllApplicationsResponse = Pick<Application, "_id" | "username" | "company" | "designation" | "jobId" | "createdAt" | "cvLink">;


// ✅ Admin users Response Type
export interface AdminFetchOverviewStatsDataResponse extends Record<string, number> {
    totalUsers: number;
    totalPackages: number;
    totalJobsAvailable: number;
    totalCompanies: number;
    totalPostions: number;
    totalApplications: number;
}

// ✅ Admin users Response Type
export interface AdminFetchUserReportStatsDataResponse extends Record<string, number> {
    totalUsers: number;
    newUsers: number;
    oldUsers: number;
    jobApplications: number;
    packageUsedUsers: number
}

// ✅ Admin Applications Response Type
export interface AdminFetchApplicationsReportStatsDataResponse extends Record<string, number> {
    totalApplications: number;
    successfulPlacements: number;
}

// ✅ Admin Revenue Response Type
export interface AdminFetchRevenueReportStatsDataResponse extends Record<string, number> {
    totalRevenue: number;
    packageRevenue: number;
    hiringRevenue: number;
}


// ✅ Admin overview page graph data Response Type
export interface AdminFetchOverviewGraphsDataResponse {
    usersGragphData: Array<{
        date: string;
        newUsers: number;
        oldUsers: number
    }>,
    applicationsGraphData: Array<{
        date: string;
        users: number;
        applications: number
    }>
}

// ✅ Admin report page user graph data Response Type
export interface AdminFetchReportUserswGraphsDataResponse {
    usersRadialGragphData: Array<{
        day: string;
        count: number;
    }>,
    usersLineGraphData: Array<{
        date: string;
        totalUsers: number;
        oldUsers: number;
        newUsers: number;
        jobApplicants: number;
        packageUsedUsers: number;
    }>
}

// ✅ Admin report page applications graph data Response Type
export interface AdminFetchReportApplicationsGraphsDataResponse {
    applicationRadialGragphData: Array<{
        day: string;
        count: number;
    }>,
    applicationsLineGraphData: Array<{
        date: string;
        totalApplicants: number;
        successfulPlacements: number;
    }>
}

// ✅ Admin report page payment and revenue graph data Response Type
export interface AdminFetchReportPaymentsGraphsDataResponse {
    paymentsRadialGragphData: Array<{
        day: string;
        count: number;
    }>,
    revenueLineGraphData: Array<{
        date: string;
        totalRevenue: number;
        packageRevenue: number;
        hiringRevenue: number;
    }>
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
export interface CreateAdminRequest extends Pick<User, "fullName" | "email" | "phone"> {
    password: string;
    profileImage: FileList;
    role: 'admin' | 'superAdmin';
    createrRole: 'superAdmin' | 'systemAdmin';
}
// Create new admin api response
export type CreateAdminResponse = Pick<User, "_id" | "fullName" | "email" | "phone" | "profileImage" | "role" | "isBlocked" | "createdAt">;
// Fetch all admins (subadmin and superAdmin)
export type AdminFetchAllAdminsResponse = Array<Pick<User, "_id" | "fullName" | "email" | "phone" | "profileImage" | "role" | "isBlocked" | "createdAt">>;

// Update admin info
export type UpdateAdminRequest = Pick<User, "_id" | "fullName" | "email" | "isBlocked" | "profileImage" | "role">;
export type UpdateAdminResponse = Pick<User, "_id" | "fullName" | "email" | "isBlocked" | "profileImage" | "role">;

// Delete admin
export type DeleteAdminRequest = Pick<User, "_id">;