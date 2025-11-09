import type { Job } from "../entities/job";
import type { User } from "../entities/user";
import type { Address } from "../entities/address";
import type { ApiBaseResponse } from "../commonTypes";
import type { CareerData } from "../entities/careerData";

export type UserfetchAllJobsResponse = Pick<
  Job,
  "_id" | "designation" | "vacancy" | "createdAt"
>;

export interface UpdateProfileImageResponse extends ApiBaseResponse {
  data: {
    profileImage: User["profileImage"];
  };
}

export type UpdateUserInfo = Pick<User, "fullName" | "phone" | "phoneTwo" | "email" | "gender" | "dob" | "nationality" | "linkedInUsername" | "portfolioUrl" | "professionalStatus">;
export interface UpdateUserInfoResponse extends ApiBaseResponse {
  data: UpdateUserInfo
}


export interface UseAddressRequest {
  data: Address,
  update: boolean;
  id: string | null | undefined;
}
export interface UpdateAddressResponse extends ApiBaseResponse {
  data: Address;
}

export type CreateUserCareerDataRequest = Pick<
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
  | "resume"
>;
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
  | "resume"
>>;
export interface CreateOrUpdateCareerDataResponse extends ApiBaseResponse {
  data: CareerData,
}