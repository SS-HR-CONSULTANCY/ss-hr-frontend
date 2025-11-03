import type { Job } from "../entities/job";
import type { User } from "../entities/user";
import type { Address } from "../entities/address";
import type { ApiBaseResponse } from "../commonTypes";

export type UserfetchAllJobsResponse = Pick<
  Job,
  "_id" | "designation" | "vacancy" | "createdAt"
>;

export interface UpdateProfileImageResponse extends ApiBaseResponse {
  data: {
    profileImage: User["profileImage"];
  };
}

export type UpdateUserInfo = Pick<User, "fullName" | "phone" | "phoneTwo" | "email" | "gender" | "dob" | "nationality" | "linkedInUrl" | "portfolioUrl">;
export interface UpdateUserInfoResponse extends ApiBaseResponse {
  data: UpdateUserInfo
}


export type UserAddress = Pick<Address, "_id" | "addressLine1" | "addressLine2" | "city" | "country" | "district" | "landmark" | "postalCode" | "state" | "primary">;
export interface UseAddressRequest {
  data: UserAddress,
  update: boolean;
  id: string | null | undefined;
}
export interface UpdateAddressResponse extends ApiBaseResponse {
  data: UserAddress;
}

  
export type CareerPreferences = Pick<User, "currentSalary" | "expectedSalary" | "immediateJoiner" | "noticePeriod" | "resumeUrl">;
export interface UpdateCareerPreferencesResponse
  extends ApiBaseResponse,
  CareerPreferences { }
