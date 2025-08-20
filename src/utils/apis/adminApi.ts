import { axiosInstance } from "@/components/lib/axios";
import { buildQueryParams, parseNewCommonResponse } from "../helpers/apiHelpers";
import { type ApiPaginatedResponse, type FetchFunctionParams } from "@/types/commonTypes";
import type { AdminfetchAllApplicationsResponse, AdminfetchAllComapniesResponse, AdminfetchAllJobsResponse, AdminfetchAllPackagesResponse, AdminfetchAllPaymentsResponse, AdminfetchAllReviewsResponse, AdminfetchAllUsersResponse, AdminFetchApplicationsReportStatsDataResponse, AdminFetchOverviewGraphsDataResponse, AdminFetchOverviewStatsDataResponse, AdminFetchReportApplicationsGraphsDataResponse, AdminFetchReportPaymentsGraphsDataResponse, AdminFetchReportUserswGraphsDataResponse, AdminFetchRevenueReportStatsDataResponse, AdminFetchUserReportStatsDataResponse } from "@/types/apiTypes/admin";

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

export const adminFetchAllPackages = async (params?: FetchFunctionParams): Promise<ApiPaginatedResponse<AdminfetchAllPackagesResponse>> => {
    const query = buildQueryParams(params);
    const response = await axiosInstance.get(`/admin/packages${query ? `?${query}` : ''}`);
    return parseNewCommonResponse<AdminfetchAllPackagesResponse>(response.data);
};

export const adminFetchAllPayments = async (params?: FetchFunctionParams): Promise<ApiPaginatedResponse<AdminfetchAllPaymentsResponse>> => {
    const query = buildQueryParams(params);
    const response = await axiosInstance.get(`/admin/payments${query ? `?${query}` : ''}`);
    return parseNewCommonResponse<AdminfetchAllPaymentsResponse>(response.data);
};

export const adminFetchAllPReviews = async (params?: FetchFunctionParams): Promise<ApiPaginatedResponse<AdminfetchAllReviewsResponse>> => {
    const query = buildQueryParams(params);
    const response = await axiosInstance.get(`/admin/reviews${query ? `?${query}` : ''}`);
    return parseNewCommonResponse<AdminfetchAllReviewsResponse>(response.data);
};

export const adminFetchAllPApplications = async (params?: FetchFunctionParams): Promise<ApiPaginatedResponse<AdminfetchAllApplicationsResponse>> => {
    const query = buildQueryParams(params);
    const response = await axiosInstance.get(`/admin/applications${query ? `?${query}` : ''}`);
    return parseNewCommonResponse<AdminfetchAllApplicationsResponse>(response.data);
};

// overview
export const adminFetchOverviewStatsData = async () : Promise<AdminFetchOverviewStatsDataResponse> => {
    const response = await axiosInstance.get('/admin/getOverviewStats');
    return response.data.data;
}

export const adminFetchOverviewGrraphData = async () : Promise<AdminFetchOverviewGraphsDataResponse> => {
    const response = await axiosInstance.get('/admin/getOverviewGraphData');
    return response.data.data;
}

// Reports stats
export const adminFetchUserReportStatsData = async () : Promise<AdminFetchUserReportStatsDataResponse> => {
    const response = await axiosInstance.get('/admin/getUserReportStatsData');
    return response.data.data;
}

export const adminFetchApplicationsReportStatsData = async () : Promise<AdminFetchApplicationsReportStatsDataResponse> => {
    const response = await axiosInstance.get('/admin/getApplicationsReportStatsData');
    return response.data.data;
}

export const adminFetchRevenueReportStatsData = async () : Promise<AdminFetchRevenueReportStatsDataResponse> => {
    const response = await axiosInstance.get('/admin/getRevenueReportStatsData');
    return response.data.data;
}

export const adminFetchReportUserGraphData = async () : Promise<AdminFetchReportUserswGraphsDataResponse> => {
    const response = await axiosInstance.get('/admin/getReportUsersGraphData');
    return response.data.data;
}

export const adminFetchReportApplicationGraphData = async () : Promise<AdminFetchReportApplicationsGraphsDataResponse> => {
    const response = await axiosInstance.get('/admin/getReportApplicationsGraphData');
    return response.data.data;
}

export const adminFetchReportPaymentsGraphData = async () : Promise<AdminFetchReportPaymentsGraphsDataResponse> => {
    const response = await axiosInstance.get('/admin/getReportPaymentsGraphData');
    return response.data.data;
}




