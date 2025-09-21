import { axiosInstance } from "@/lib/axios";
import { buildQueryParams, parseNewCommonResponse } from "../helpers/apiHelpers";
import { type ApiPaginatedResponse, type FetchFunctionParams } from "@/types/commonTypes";
import type { AdminfetchAllApplicationsResponse, AdminFetchApplicationsReportStatsDataResponse, AdminFetchOverviewGraphsDataResponse, AdminFetchOverviewStatsDataResponse, AdminFetchReportApplicationsGraphsDataResponse, AdminFetchReportPaymentsGraphsDataResponse, AdminFetchReportTableDataResponse, AdminFetchReportUserswGraphsDataResponse, AdminFetchRevenueReportStatsDataResponse, AdminFetchUserReportStatsDataResponse } from "@/types/apiTypes/adminApiTypes";

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

export const AdminFetchReportTableData = async (params?: FetchFunctionParams) : Promise<ApiPaginatedResponse<AdminFetchReportTableDataResponse>> => {
    const query = buildQueryParams(params);
    const response = await axiosInstance.get(`/admin/reportTableData${query ? `?${query}` : ''}`);
    return parseNewCommonResponse<AdminFetchReportTableDataResponse>(response.data);
}