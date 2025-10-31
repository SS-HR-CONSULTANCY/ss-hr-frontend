import { axiosInstance } from "@/lib/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { updateAddressResponse, updateProfileImageResponse, updateUserInfo, updateUserInfoResponse, userAddress, UserfetchAllJobsResponse } from "@/types/apiTypes/userApiTypes";
import type {
  ApiPaginatedResponse,
  FetchFunctionParams,
} from "@/types/commonTypes";
import {
  buildQueryParams,
  parseNewCommonResponse,
} from "@/utils/helpers/apiHelpers";

export const updateProfileImage = createAsyncThunk<
  updateProfileImageResponse,
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
  updateUserInfoResponse,
  updateUserInfo
>("/user/UpdateProfileImage", async (data: updateUserInfo) => {
  const response = await axiosInstance.patch("/user/profile", data);
  return response.data;
});


export const updateUserAddress = createAsyncThunk<
  updateAddressResponse,
  userAddress
>("/user/UpdateProfileImage", async (data: userAddress) => {
  const response = await axiosInstance.patch("/user/Address", data);
  return response.data;
});

