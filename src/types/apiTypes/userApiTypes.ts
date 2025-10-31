import type { ApiBaseResponse } from "../commonTypes";
import type { Address } from "../entities/address";
import type { Job } from "../entities/job";
import type { User } from "../entities/user";

export type UserfetchAllJobsResponse = Pick<
  Job,
  "_id" | "designation" | "vacancy" | "createdAt"
>;

export interface updateProfileImageResponse extends ApiBaseResponse {
  data: {
    profileImage: User["profileImage"];
  };
}

export type updateUserInfo = Pick<User, "fullName" | "phone" | "phoneTwo" | "email" | "gender" | "dob" | "nationality" | "linkedInUrl" | "portfolioUrl">;
export interface updateUserInfoResponse
  extends ApiBaseResponse,
    updateUserInfo {}


export type userAddress = Pick<Address, "addressLine1" | "addressLine2" | "city" | "country" | "district" | "landmark" | "poBox" | "postalCode" | "state">;
export interface updateAddressResponse
  extends ApiBaseResponse,
    userAddress {}
