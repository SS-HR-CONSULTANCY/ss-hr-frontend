import type {
  ApiBaseResponse,
  ApiPaginatedResponse,
  FetchFunctionParams,
} from "@/types/commonTypes";
import {
  buildQueryParams,
  parseNewCommonResponse,
} from "@/utils/helpers/apiHelpers";
import {
  type UpdateUserInfo,
  type UseAddressRequest,
  type UpdateResumeRequest,
  type UserApplyJobResponse,
  type UpdateAddressResponse,
  type UpdateUserInfoResponse,
  type UserfetchAllJobsResponse,
  type UpdateProfileImageResponse,
  type CreateUserCareerDataRequest,
  type UpdateUserCareerDataRequest,
  type UserUpdateApplicationResponse,
  type CreateOrUpdateCareerDataResponse,
  type UserFetchAllApplicationsResponse,
  type UserUpdateApplicationStatusRequest,
  type UpdateProfileImageRequest,
  type UserFetchJobDetailsResponse,
} from "@/types/apiTypes/userApiTypes";
import { axiosInstance } from "@/lib/axios";
import type { Job } from "@/types/entities/job";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateProfileImage = createAsyncThunk<
  UpdateProfileImageResponse,
  UpdateProfileImageRequest
>("/user/UpdateProfileImage", async (data) => {
  const response = await axiosInstance.patch("/user/prfileImage", data);
  return response.data;
});

export const userFetchAllJobs = async (
  params?: FetchFunctionParams,
): Promise<ApiPaginatedResponse<UserfetchAllJobsResponse>> => {
  const query = buildQueryParams(params);
  const response = await axiosInstance.get(
    `/user/jobs${query ? `?${query}` : ""}`,
  );
  return parseNewCommonResponse<UserfetchAllJobsResponse>(response.data);
};

export const updateProfileInfo = createAsyncThunk<
  UpdateUserInfoResponse,
  UpdateUserInfo
>("/user/UpdateProfileInfo", async (data: UpdateUserInfo) => {
  const response = await axiosInstance.patch("/user/profile", data);
  return response.data;
});

export const createAddress = createAsyncThunk<
  UpdateAddressResponse,
  UseAddressRequest
>("/user/addAddress", async (payload: UseAddressRequest) => {
  let response;
  if (payload.update) {
    response = await axiosInstance.patch(
      `/user/address/${payload.id}`,
      payload.data,
    );
  } else {
    response = await axiosInstance.post("/user/address", payload.data);
  }
  return response.data;
});

export const createCareerData = createAsyncThunk<
  CreateOrUpdateCareerDataResponse,
  CreateUserCareerDataRequest
>("/user/career-data", async (data) => {
  const response = await axiosInstance.post("user/career", data);
  return response.data;
});

export const updateCareerData = createAsyncThunk<
  CreateOrUpdateCareerDataResponse,
  UpdateUserCareerDataRequest
>("/user/career-data", async (data) => {
  const response = await axiosInstance.patch(`user/career/${data._id}`, data);
  return response.data;
});

export const updateResume = createAsyncThunk<
  ApiBaseResponse,
  UpdateResumeRequest
>("/user/resume-data", async (data) => {
  const response = await axiosInstance.patch(`/user/resume`, data);
  return response.data;
});

export const userApplyJob = async (
  _id: Job["_id"],
): Promise<UserApplyJobResponse> => {
  const response = await axiosInstance.post(`/user/apply-job/${_id}`);
  return response.data;
};

export const userFetchAllApplications = async (
  params?: FetchFunctionParams,
): Promise<ApiPaginatedResponse<UserFetchAllApplicationsResponse>> => {
  const query = buildQueryParams(params);
  const response = await axiosInstance.get(
    `/user/applications${query ? `?${query}` : ""}`,
  );
  return parseNewCommonResponse<UserFetchAllApplicationsResponse>(
    response.data,
  );
};

export const userUpdateJobApplication = async (
  data: UserUpdateApplicationStatusRequest,
): Promise<UserUpdateApplicationResponse> => {
  const response = await axiosInstance.patch(`/user/cancel-job/${data._id}`, {
    status: data.status,
  });
  return response.data;
};

export const userGetJobById = async (
  jobId: string,
): Promise<UserFetchJobDetailsResponse> => {
  const response = await axiosInstance.get(`/user/jobs/${jobId}`);
  return response.data.data;
};

export const userFetchAllPackages = async (
  params?: FetchFunctionParams & { category?: string },
): Promise<ApiPaginatedResponse<import("@/types/entities/package").Package>> => {
  const query = buildQueryParams(params);
  const categoryParam = params?.category ? `&category=${params.category}` : "";
  const response = await axiosInstance.get(
    `/user/packages${query ? `?${query}${categoryParam}` : (categoryParam ? `?${categoryParam.slice(1)}` : "")}`,
  );
  return parseNewCommonResponse(response.data);
};
