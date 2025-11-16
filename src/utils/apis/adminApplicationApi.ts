import { axiosInstance } from "@/lib/axios";
import { buildQueryParams, parseNewCommonResponse } from "../helpers/apiHelpers";
import type { ApiPaginatedResponse, FetchFunctionParams } from "@/types/commonTypes";
import type { AdminfetchAllApplicationsResponse, AdminFetchApplicationDetailsResponse, AdminUpdateApplicationStatusRequest, AdminUpdateApplicationStatusResponse } from "@/types/apiTypes/adminApiTypes";

export const adminFetchAllPApplications = async (
    params?: FetchFunctionParams,
): Promise<ApiPaginatedResponse<AdminfetchAllApplicationsResponse>> => {
    const query = buildQueryParams(params);
    const response = await axiosInstance.get(
        `/admin/applications${query ? `?${query}` : ""}`,
    );
    return parseNewCommonResponse<AdminfetchAllApplicationsResponse>(
        response.data,
    );
};

export const adminGetApplicationById = async (
  applicationId: string,
): Promise<AdminFetchApplicationDetailsResponse> => {
  const response = await axiosInstance.get(`/admin/applications/${applicationId}`);
  return response.data.data;
};

export const adminUpdateApplicationStatus = async (
  data: AdminUpdateApplicationStatusRequest,
): Promise<AdminUpdateApplicationStatusResponse> => {
  const response = await axiosInstance.patch(`/admin/applications/${data._id}`,{ status: data.status });
  return response.data;
};