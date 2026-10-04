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
  source: string;
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
