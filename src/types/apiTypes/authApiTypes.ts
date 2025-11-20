import type { User } from "../entities/user";
import type { Address } from "../entities/address";
import type { ApiBaseResponse } from "../commonTypes";
import type { CareerData } from "../entities/careerData";

// sign up
export interface SignupResponse extends ApiBaseResponse {
  user: User;
}

// verify otp
export type VerifyOtpRequest = Pick<User, "otp" | "verificationToken" | "role">;

// sign in
export type SigninRequest = Pick<User, "email" | "role"> & {
  password: string;
};
export interface SigninResponse extends ApiBaseResponse {
  user: User;
  address: Address;
  careerData: CareerData;
}

// resend otp
export type ResendOtpRequest = Pick<User, "role" | "verificationToken"> & {
  email?: string;
};
export interface ResendOtpResponse extends ApiBaseResponse {
  user: User;
}

// update password
export type UpdatePasswordRequest = Pick<
  User,
  "email" | "verificationToken" | "role"
> & {
  password: string;
};

// update password
export type VerifyEmailRequest = Pick<User, "email">;
export interface VerifyEmailResponse extends ApiBaseResponse {
  data: Pick<User, "email" | "verificationToken" | "role">;
}
