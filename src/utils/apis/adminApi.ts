import {
  buildQueryParams,
  parseNewCommonResponse,
} from "../helpers/apiHelpers";
import {
  type ApiPaginatedResponse,
  type FetchFunctionParams,
} from "@/types/commonTypes";
import type {
  AdminFetchReportTableDataResponse,
  AdminFetchOverviewStatsDataResponse,
  AdminFetchReportPaymentsGraphsDataResponse,
  AdminFetchEnquiryAnalyticsResponse,
  AdminFetchEnquirySummaryStatsResponse,
  AdminFetchAccountLeadsResponse
} from "@/types/apiTypes/adminApiTypes";
import { axiosInstance } from "@/lib/axios";

// overview
export const adminFetchOverviewStatsData =
  async (): Promise<AdminFetchOverviewStatsDataResponse> => {
    const response = await axiosInstance.get("/admin/users/overview/stats");
    return response.data.data;
  };

export const adminFetchComprehensiveOverviewData =
  async (): Promise<AdminFetchComprehensiveOverviewResponse> => {
    const response = await axiosInstance.get("/admin/users/overview/comprehensive");
    return response.data.data;
  };

export const adminFetchEnquiryAnalyticsData =
  async (period: string, status: string, category: string): Promise<AdminFetchEnquiryAnalyticsResponse[]> => {
    const query = new URLSearchParams({ period });
    if (status && status !== 'all') {
      query.append('status', status);
    }
    if (category && category !== 'all') {
      query.append('category', category);
    }
    const response = await axiosInstance.get(`/admin/enquiries/analytics?${query.toString()}`);
    return response.data.data;
  };

export const adminFetchEnquirySummaryStats =
  async (): Promise<AdminFetchEnquirySummaryStatsResponse> => {
    const response = await axiosInstance.get("/admin/enquiries/summary-stats");
    return response.data.data;
  };

export const adminFetchEnquiryStatusDistribution =
  async (period: string): Promise<Array<{ status: string; count: number }>> => {
    const query = new URLSearchParams({ period });
    const response = await axiosInstance.get(`/admin/enquiries/status-distribution?${query.toString()}`);
    return response.data.data;
  };

export const adminFetchReportPaymentsGraphData =
  async (): Promise<AdminFetchReportPaymentsGraphsDataResponse> => {
    const response = await axiosInstance.get("/admin/payments/graph-data");
    return response.data?.data || { monthlyData: [], yearlyData: [] };
  };

export const AdminFetchReportTableData = async (
  params?: FetchFunctionParams,
): Promise<ApiPaginatedResponse<AdminFetchReportTableDataResponse>> => {
  const query = buildQueryParams(params);
  const response = await axiosInstance.get(
    `/admin/reportTableData${query ? `?${query}` : ""}`,
  );
  return parseNewCommonResponse<AdminFetchReportTableDataResponse>(
    response.data,
  );
};

export const adminFetchAccountLeads = async (
  accountName: string,
): Promise<AdminFetchAccountLeadsResponse[]> => {
  const response = await axiosInstance.get(
    `/admin/enquiries/account/${encodeURIComponent(accountName)}`,
  );
  return response.data.data;
};
