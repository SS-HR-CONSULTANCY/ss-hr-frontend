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
} from "@/types/apiTypes/adminApiTypes";
import { axiosInstance } from "@/lib/axios";

// overview
export const adminFetchOverviewStatsData =
  async (): Promise<AdminFetchOverviewStatsDataResponse> => {
    const response = await axiosInstance.get("/admin/users/overview/stats");
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
