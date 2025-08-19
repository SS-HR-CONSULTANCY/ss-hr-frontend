import { axiosInstance } from "@/components/lib/axios";
import type { AdminfetchAllUsersResponse } from "@/types/apiTypes/admin";
import { buildQueryParams, parseNewCommonResponse } from "../helpers/apiHelpers";
import { type ApiPaginatedResponse, type FetchFunctionParams } from "@/types/commonTypes";

export const adminFetchAllProviders = async (params?: FetchFunctionParams): Promise<ApiPaginatedResponse<AdminfetchAllUsersResponse>> => {
    const query = buildQueryParams(params);
    const response = await axiosInstance.get(`/admin/providers${query ? `?${query}` : ''}`);
    return parseNewCommonResponse<AdminfetchAllUsersResponse>(response.data);
};