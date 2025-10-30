import type { ApiBaseResponse } from "../commonTypes";
import type { User } from "../entities/user";

export interface SignupResponse extends ApiBaseResponse {
  user: User;
}

export type VerifyOtpRequest = Pick<User, "otp" | "verificationToken" | "role">;

export type SigninRequest = Pick<User, "email" | "role"> & {
  password: string;
};

export interface SigninResponse extends ApiBaseResponse {
  user: User;
}

export interface ResendOtpResponse extends ApiBaseResponse {
  user: User;
}

export type ResendOtpRequest = Pick<User, "role" | "verificationToken"> & {
  email?: string;
};

export type UpdatePasswordRequest = Pick<User, "role" | "verificationToken"> & {
  password: string;
  confirmPassword: string;
};

export interface updateProfileImageResponse extends ApiBaseResponse {
  data: {
    profileImage: User["profileImage"];
  };
}

export type updateUserInfo = Pick<User, "fullName" | "phone" | "phoneTwo" | "email" | "gender" | "dob" | "nationality" | "linkedInUrl" | "portfolioUrl">;
export interface updateUserInfoResponse
  extends ApiBaseResponse,
    updateUserInfo {}
