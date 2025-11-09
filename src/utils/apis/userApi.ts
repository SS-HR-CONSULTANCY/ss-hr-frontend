import { axiosInstance } from "@/lib/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  type CreateOrUpdateCareerDataResponse,
  type CreateUserCareerDataRequest,
  type UpdateAddressResponse,
  type UpdateProfileImageResponse,
  type UpdateResumeRequest,
  type UpdateUserCareerDataRequest,
  type UpdateUserInfo,
  type UpdateUserInfoResponse,
  type UseAddressRequest,
  type UserfetchAllJobsResponse
} from "@/types/apiTypes/userApiTypes";
import type {
  ApiBaseResponse,
  ApiPaginatedResponse,
  FetchFunctionParams,
} from "@/types/commonTypes";
import {
  buildQueryParams,
  parseNewCommonResponse,
} from "@/utils/helpers/apiHelpers";

export const updateProfileImage = createAsyncThunk<
  UpdateProfileImageResponse,
  FormData
>("/user/UpdateProfileImage", async (formData: FormData) => {
  const response = await axiosInstance.patch("/user/prfileImage", formData);
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
    response = await axiosInstance.patch(`/user/address/${payload.id}`, payload.data);
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
  console.log("data : ",data);
  const response = await axiosInstance.patch(`/user/resume`, {key: data.resume});
  console.log("response : ",response);
  return response.data;
});
