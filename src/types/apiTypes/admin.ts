import type { Job } from "../entities/job";
import type { User } from "../entities/user";
import type { Review } from "../entities/review";
import type { Company } from "../entities/company";
import type { Package } from "../entities/package";
import type { Payment } from "../entities/payment";
import type { ApiBaseResponse } from "../commonTypes";
import type { Application } from "../entities/application";

export type AdminfetchAllUsersResponse = Pick<User, "_id" | "email" | "isBlocked" | "isVerified" | "profileImg" | "fullName" | "createdAt">;

export type AdminfetchAllComapniesResponse = Pick<Company, "_id" | "companyLogo" | "companyName" | "email" | "availableJobCount" | "createdAt">;

export type AdminfetchAllJobsResponse = Pick<Job, "companyName" | "jobPost" | "availableCount" | "createdAt">;

export type AdminfetchAllPackagesResponse = Pick<Package, "packageName" | "description" | "price" | "features" | "createdAt">;

export type AdminfetchAllPaymentsResponse = Pick<Payment, "transactionId" | "totalAmount" | "discountAmount" | "paymentStatus" | "createdAt" | "username">;

export type AdminfetchAllReviewsResponse = Pick<Review, "text" | "username" | "createdAt" | "job">;

export type AdminfetchAllApplicationsResponse = Pick<Application, "username" | "company" | "designation" | "jobId" | "createdAt" | "cvLink">;

export type AdminfetchAllUsersForChatSidebarResponse = Array<Pick<User, "_id" | "fullName" | "profileImg">>;

// ✅ Admin users Response Type
export interface AdminFetchOverviewStatsDataResponse extends Record<string, number> {
    totalUsers: number;
    totalPackages: number;
    totalJobsAvailable: number;
    totalCompanies: number;
    totalPostions: number;
    totalPayments: number;
    totalRevenue: number;
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
    paymentsGraphData: Array<{
        date: string;
        newUsers: number;
        oldUsers: number
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



// Admin settings website company andme logo updating api request payload interface
export interface AdminUpdateWebsiteLogoAndNameRequest {
    companyName?: string;
    logo?: File;
};

// Admin settings website company andme logo updating api response interface
export interface AdminUpdateWebsiteLogoAndNameResponse extends ApiBaseResponse {
    companyName?: string;
    logo?: string;
};

// Admin settings website company andme logo current data fetching api response
export interface AdminGetWebsiteSettingsResponse {
    companyName: string;
    logo: string;
}



// Admin settings website footer data updating api request
export interface AdminUpdateFooterDataRequest {
    address?: string;
    location?: string;
    phoneIndia?: string;
    phoneUAE?: string;
    facebookUrl?: string;
    xUrl?: string;
    instagramUrl?: string;
    email?: string;
    timingInida?: string;
    timingUae?: string;
};

// Admin settings website footer data fetching api response
export interface AdminUpdateFooterDataResponse extends ApiBaseResponse {
    address?: string;
    location?: string;
    phoneIndia?: string;
    phoneUAE?: string;
    facebookUrl?: string;
    xUrl?: string;
    instagramUrl?: string;
    email?: string;
    timingInida?: string;
    timingUae?: string;
};

// Admin settings website footer current data fetching api response
export interface AdminGetFooterCurrentDataResponse {
  address: string;
  location: string;
  phoneIndia: string;
  phoneUAE: string;
  facebookUrl: string;
  xUrl: string;
  instagramUrl: string;
  companyEmail: string;
  timingInida: string;
  timingUae: string;
}




export interface AdminUpdateWebsiteAboutRequest {
     aboutText: string;
};

export interface AdminUpdateWebsiteAboutResponse extends ApiBaseResponse {
     aboutText: string;
};

export interface AdminGetAboutCurrentDataResponse {
  aboutText: string;
}


// Create new admin api request
export interface CreateAdminRequest extends Pick<User, "fullName" | "email" | "profileImg"> {
    password: string;
    role: 'subadmin' | 'superAdmin';
}
// Create new admin api response
export type CreateAdminResponse = Pick<User, "_id" | "fullName" | "email" | "isBlocked" | "profileImg" | "role">;

// Fetch all admins (subadmin and superAdmin)
export type GetAdminsResponse = Array<Pick<User, "_id" | "fullName" | "email" | "isBlocked" | "profileImg" | "role">>;

// Update admin info
export type UpdateAdminRequest = Pick<User, "_id" | "fullName" | "email" | "isBlocked" | "profileImg" | "role">;
export type UpdateAdminResponse = Pick<User, "_id" | "fullName" | "email" | "isBlocked" | "profileImg" | "role">;

// Block/Unblock admin
export type BlockAdminRequest = Pick<User, "_id" | "isBlocked">; 

export type BlockAdminResponse = Pick<User, "_id" | "fullName" | "email" | "isBlocked" | "profileImg" | "role">;

// Delete admin
export type DeleteAdminRequest = Pick<User, "_id">;