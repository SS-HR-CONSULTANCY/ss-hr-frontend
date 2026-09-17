import { axiosInstance } from "@/lib/axios";
import type { ApiBaseResponse, ApiPaginatedResponse, FetchFunctionParams } from "@/types/commonTypes";
import { buildQueryParams, parseNewCommonResponse } from "@/utils/helpers/apiHelpers";
import type { AdminFetchAllEnquiriesResponse } from "@/types/apiTypes/adminApiTypes";

export const adminFetchAllEnquiries = async (
  params?: FetchFunctionParams,
): Promise<ApiPaginatedResponse<AdminFetchAllEnquiriesResponse>> => {
  const query = buildQueryParams(params);
  const response = await axiosInstance.get(`/admin/enquiries${query ? `?${query}` : ""}`);
  return parseNewCommonResponse(response.data);
};

export const adminUpdateEnquiryStatus = async (props: {
  enquiryId: string;
  status: "pending" | "contacted" | "need_follow_up" | "processing_application" | "completed";
}): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.patch(`/admin/enquiries/${props.enquiryId}/status`, {
    status: props.status,
  });
  return response.data;
};

export const adminDeleteEnquiry = async (
  enquiryId: string
): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.delete(`/admin/enquiries/${enquiryId}`);
  return response.data;
};

export const adminUpdateEnquiryAccount = async (props: {
  enquiryId: string;
  account: string | null;
}): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.patch(`/admin/enquiries/${props.enquiryId}/account`, {
    account: props.account,
  });
  return response.data;
};

