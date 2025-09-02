import { axiosInstance } from "@/lib/axios";
import type { UserfetchAllJobsResponse } from "@/types/apiTypes/user";
import type { ApiPaginatedResponse, FetchFunctionParams } from "@/types/commonTypes";
import { buildQueryParams, parseNewCommonResponse } from "@/utils/helpers/apiHelpers";

export const adminFetchAllJobs = async (params?: FetchFunctionParams): Promise<ApiPaginatedResponse<UserfetchAllJobsResponse>> => {
    const query = buildQueryParams(params);
    const response = await axiosInstance.get(`/user/jobs${query ? `?${query}` : ''}`);
    return parseNewCommonResponse<UserfetchAllJobsResponse>(response.data);
};