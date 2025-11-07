import type { User } from "../entities/user";
import type { Address } from "../entities/address";
import type { ApiBaseResponse } from "../commonTypes";
import type { CareerData } from "../entities/careerData";

export interface SignupResponse extends ApiBaseResponse {
  user: User;
}

export type VerifyOtpRequest = Pick<User, "otp" | "verificationToken" | "role">;

export type SigninRequest = Pick<User, "email" | "role"> & {
  password: string;
};

export interface SigninResponse extends ApiBaseResponse {
  user: User;
  address: Address;
  careerData: CareerData;
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
