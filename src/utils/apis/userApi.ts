import { axiosInstance } from "@/components/lib/axios";
import type { UserfetchAllJobsResponse } from "@/types/apiTypes/user";
import { buildQueryParams, parseNewCommonResponse } from "../helpers/apiHelpers";
import type { ApiPaginatedResponse, FetchFunctionParams } from "@/types/commonTypes";

export const adminFetchAllJobs = async (params?: FetchFunctionParams): Promise<ApiPaginatedResponse<UserfetchAllJobsResponse>> => {
    const query = buildQueryParams(params);
    const response = await axiosInstance.get(`/user/jobs${query ? `?${query}` : ''}`);
    return parseNewCommonResponse<UserfetchAllJobsResponse>(response.data);
};