import type { Job } from "../entities/job";
import type { User } from "../entities/user";
import type { Address } from "../entities/address";
import type { ApiBaseResponse } from "../commonTypes";
import type { CareerData } from "../entities/careerData";
import type { Application } from "../entities/application";

// User Update Profile image
export type UpdateProfileImageRequest = Pick<User, "profileImage">
export interface UpdateProfileImageResponse extends ApiBaseResponse {
  data: {
    profileImage: User["profileImage"];
  };
}


// User Profile Info
export type UpdateUserInfo = Pick<User, "fullName" | "phone" | "phoneTwo" | "email" | "gender" | "dob" | "nationality" | "professionalStatus"> & Partial<Pick<User, "linkedInUsername" | "portfolioUrl">>;
export interface UpdateUserInfoResponse extends ApiBaseResponse {
  data: UpdateUserInfo
}


// User Address
export interface UseAddressRequest {
  data: Address,
  update: boolean;
  id: string | null | undefined;
}
export interface UpdateAddressResponse extends ApiBaseResponse {
  data: Address;
}


// User Career Data
export type CreateUserCareerDataRequest = Partial<Pick<
  CareerData,
  | "currentSalary"
  | "expectedSalary"
  | "immediateJoiner"
  | "noticePeriod"
  | "experience"
  | "currentDesignation"
  | "currentCompany"
  | "industry"
  | "currentJobType"
  | "preferredJobTypes"
  | "preferredWorkModes"
>>;
export type UpdateUserCareerDataRequest = Partial<Pick<
  CareerData,
  "_id"
  | "currentSalary"
  | "expectedSalary"
  | "immediateJoiner"
  | "noticePeriod"
  | "experience"
  | "currentDesignation"
  | "currentCompany"
  | "industry"
  | "currentJobType"
  | "preferredJobTypes"
  | "preferredWorkModes"
>>;
export interface CreateOrUpdateCareerDataResponse extends ApiBaseResponse {
  data: CareerData,
}


// User update resume
export type UpdateResumeRequest = Pick<User, "resume">; 


// User fetch all jobs 
export type UserfetchAllJobsResponse = Pick<Job,"_id" | "designation" | "vacancy" | "createdAt" | "jobUniqueId"> & {
  applied: boolean;
};


// User Apply job
export interface UserApplyJobResponse extends ApiBaseResponse {
  data: Pick<Application, "jobId" | "status">
};

export type UserFetchJobDetailsResponse = Omit<Job, "updatedAt" | "compnayName">;



// User application Update
export type UserUpdateApplicationStatusRequest = Pick<Application, "_id" | "status">;
export interface UserUpdateApplicationResponse extends ApiBaseResponse {
  data: Pick<Application, "jobId" | "status">
};


// User fetch applications
export type UserFetchAllApplicationsResponse = Pick<Job,"_id" | "designation" | "jobUniqueId"> & Pick<Application, "updatedAt" | "status" | "_id">

