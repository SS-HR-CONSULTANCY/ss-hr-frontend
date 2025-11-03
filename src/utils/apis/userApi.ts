import { axiosInstance } from "@/lib/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { 
  CareerPreferences, UpdateAddressResponse, UpdateCareerPreferencesResponse, UpdateProfileImageResponse, UpdateUserInfo, UpdateUserInfoResponse, UseAddressRequest, UserfetchAllJobsResponse } from "@/types/apiTypes/userApiTypes";
import type {
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
  if(payload.update) {
    response = await axiosInstance.patch(`/user/address/${payload.id}`, payload.data);
  } else {
    response = await axiosInstance.post("/user/address", payload.data);
  }
  return response.data;
});



export const updateUserCareerPreferences = createAsyncThunk<
  UpdateCareerPreferencesResponse,
  CareerPreferences
>("/user/UpdateCareerPreferences", async (data: CareerPreferences) => {
  const response = await axiosInstance.patch("/user/career", data);
  return response.data;
});

