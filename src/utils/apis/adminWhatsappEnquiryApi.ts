import { axiosInstance } from "@/lib/axios";
import type { ApiBaseResponse, FetchFunctionParams } from "../../types/commonTypes";
import type { AdminFetchAllWhatsappEnquiriesResponse } from "../../types/apiTypes/adminApiTypes";
import { buildQueryParams } from "../helpers/apiHelpers";
import type { EnquiryStatusKey } from "../enquiryStatusConfig";

export const adminCreateWhatsappEnquiry = async (
  data: Partial<AdminFetchAllWhatsappEnquiriesResponse>
): Promise<ApiBaseResponse & { data: AdminFetchAllWhatsappEnquiriesResponse }> => {
  const response = await axiosInstance.post(`/admin/whatsapp-enquiries`, data);
  return response.data;
};

export const adminFetchAllWhatsappEnquiries = async (params?: FetchFunctionParams): Promise<ApiBaseResponse & { data: AdminFetchAllWhatsappEnquiriesResponse[] }> => {
  const query = buildQueryParams(params);
  const response = await axiosInstance.get(`/admin/whatsapp-enquiries${query ? `?${query}` : ""}`);
  return response.data;
};

export const adminUpdateWhatsappEnquiry = async (
  enquiryId: string,
  data: Partial<AdminFetchAllWhatsappEnquiriesResponse>
): Promise<ApiBaseResponse & { data: AdminFetchAllWhatsappEnquiriesResponse }> => {
  const response = await axiosInstance.put(`/admin/whatsapp-enquiries/${enquiryId}`, data);
  return response.data;
};

export const adminUpdateWhatsappEnquiryStatus = async (props: {
  enquiryId: string;
  status: EnquiryStatusKey;
}): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.patch(`/admin/whatsapp-enquiries/${props.enquiryId}/status`, {
    status: props.status,
  });
  return response.data;
};

export const adminDeleteWhatsappEnquiry = async (
  enquiryId: string
): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.delete(`/admin/whatsapp-enquiries/${enquiryId}`);
  return response.data;
};

export const adminUpdateWhatsappEnquiryComment = async (props: {
  enquiryId: string;
  comment: string | null;
}): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.patch(`/admin/whatsapp-enquiries/${props.enquiryId}/comment`, {
    comment: props.comment,
  });
  return response.data;
};

export const adminUpdateWhatsappEnquiryReminder = async (props: {
  enquiryId: string;
  reminder: string | null;
}): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.patch(`/admin/whatsapp-enquiries/${props.enquiryId}/reminder`, {
    reminder: props.reminder,
  });
  return response.data;
};
