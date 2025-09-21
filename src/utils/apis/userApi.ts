import { axiosInstance } from "@/lib/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { UserfetchAllJobsResponse } from "@/types/apiTypes/userApiTypes";
import type { updateProfileImageResponse } from "@/types/apiTypes/authApiTypes";
import type { ApiPaginatedResponse, FetchFunctionParams } from "@/types/commonTypes";
import { buildQueryParams, parseNewCommonResponse } from "@/utils/helpers/apiHelpers";

export const updateProfileImage = createAsyncThunk<updateProfileImageResponse, FormData>('/auth/UpdateProfileImage',
    async (formData: FormData) => {
        const response = await axiosInstance.patch('/user/prfileImage', formData);
        console.log("response : ",response);
        return response.data;
    }
)

export const userFetchAllJobs = async (params?: FetchFunctionParams): Promise<ApiPaginatedResponse<UserfetchAllJobsResponse>> => {
    const query = buildQueryParams(params);
    const response = await axiosInstance.get(`/user/jobs${query ? `?${query}` : ''}`);
    return parseNewCommonResponse<UserfetchAllJobsResponse>(response.data);
};