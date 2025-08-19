import { axiosInstance } from "@/components/lib/axios";
import { buildQueryParams, parseNewCommonResponse } from "../helpers/apiHelpers";
import { type ApiPaginatedResponse, type FetchFunctionParams } from "@/types/commonTypes";
import type { AdminfetchAllComapniesResponse, AdminfetchAllJobsResponse, AdminfetchAllUsersResponse } from "@/types/apiTypes/admin";

export const adminFetchAllUsers = async (params?: FetchFunctionParams): Promise<ApiPaginatedResponse<AdminfetchAllUsersResponse>> => {
    const query = buildQueryParams(params);
    const response = await axiosInstance.get(`/admin/users${query ? `?${query}` : ''}`);
    return parseNewCommonResponse<AdminfetchAllUsersResponse>(response.data);
};

export const adminFetchAllCompanies = async (params?: FetchFunctionParams): Promise<ApiPaginatedResponse<AdminfetchAllComapniesResponse>> => {
    const query = buildQueryParams(params);
    const response = await axiosInstance.get(`/admin/companies${query ? `?${query}` : ''}`);
    return parseNewCommonResponse<AdminfetchAllComapniesResponse>(response.data);
};

export const adminFetchAllJobs = async (params?: FetchFunctionParams): Promise<ApiPaginatedResponse<AdminfetchAllJobsResponse>> => {
    const query = buildQueryParams(params);
    const response = await axiosInstance.get(`/admin/jobs${query ? `?${query}` : ''}`);
    return parseNewCommonResponse<AdminfetchAllJobsResponse>(response.data);
};