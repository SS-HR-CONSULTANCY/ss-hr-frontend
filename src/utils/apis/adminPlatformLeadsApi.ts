import { axiosInstance } from "@/lib/axios";
import { buildQueryParams } from "../helpers/apiHelpers";
import type { FetchFunctionParams, ApiPaginatedResponse } from "@/types/commonTypes";

export interface ImportedCustomer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  designations: string[];
  cvUrl: string;
  linkedinUrl?: string;
  source: string;
  status: string;
  comment: string;
  scheduledDate?: string;
  createdAt: string;
}

export const adminFetchAllPlatformLeads = async (
  params?: FetchFunctionParams
): Promise<ApiPaginatedResponse<ImportedCustomer>> => {
  const query = buildQueryParams(params);
  const response = await axiosInstance.get(
    `/imported-customers${query ? `?${query}` : ""}`
  );
  
  const resData = response.data.data;
  return {
    data: resData.customers,
    totalCount: resData.total,
    currentPage: resData.page,
    totalPages: resData.totalPages,
  };
};

export const adminUpdatePlatformLead = async (
  id: string,
  payload: { status: string; comment: string; scheduledDate?: string; state?: string }
): Promise<ImportedCustomer> => {
  const response = await axiosInstance.patch(`/imported-customers/${id}/telecall`, payload);
  return response.data.data;
};
