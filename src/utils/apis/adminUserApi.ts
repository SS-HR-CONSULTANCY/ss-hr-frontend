import { axiosInstance } from "@/lib/axios";
import type { User } from "@/types/entities/user";
import type { AdminfetchAllUsersResponse, AdminFetchUserDetailsResponse } from "@/types/apiTypes/adminApiTypes";
import {
  buildQueryParams,
  parseNewCommonResponse,
} from "../helpers/apiHelpers";
import type {
  ApiPaginatedResponse,
  FetchFunctionParams,
} from "@/types/commonTypes";

export interface UserResponse {
  success: boolean;
  message: string;
  data: User[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export interface SingleUserResponse {
  success: boolean;
  message: string;
  user: User;
}

export type CreateUserRequest = Pick<User, "fullName" | "email" | "phone" | "phoneTwo"> & {
  password: string;
} 

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  phoneTwo?: string;
  isBlocked?: boolean;
  isVerified?: boolean;
}

export const adminFetchAllUsers = async (
  params?: FetchFunctionParams,
): Promise<ApiPaginatedResponse<AdminfetchAllUsersResponse>> => {
  const query = buildQueryParams(params);
  const response = await axiosInstance.get(
    `/admin/users${query ? `?${query}` : ""}`,
  );
  return parseNewCommonResponse<AdminfetchAllUsersResponse>(response.data);
};

export const adminCreateUser = async (userData: CreateUserRequest) => {
  return await axiosInstance.post("/admin/users", userData);
};

export const adminFetchUserById = async (userId: string) => {
  return await axiosInstance.get(`/admin/users/${userId}`);
};

export const adminUpdateUser = async (
  userId: string,
  userData: UpdateUserRequest,
) => {
  return await axiosInstance.put(`/admin/users/${userId}`, userData);
};

export const adminDeleteUser = async (userId: string) => {
  return await axiosInstance.delete(`/admin/users/${userId}`);
};

export const adminFetchUserStats = async () => {
  return await axiosInstance.get("/admin/users/stats");
};


export const adminGetUserDetailsId = async (
  userId: string,
): Promise<AdminFetchUserDetailsResponse> => {
  const response = await axiosInstance.get(`/admin/users/details/${userId}`);
  console.log("response : ",response);
  return response.data.data;
};