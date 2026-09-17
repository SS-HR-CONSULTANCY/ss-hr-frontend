import { axiosInstance } from "@/lib/axios";
import type { ApiBaseResponse } from "../../types/commonTypes";
import type { AdminFetchAllWhatsappEnquiriesResponse } from "../../types/apiTypes/adminApiTypes";

export const adminCreateWhatsappEnquiry = async (
  data: Partial<AdminFetchAllWhatsappEnquiriesResponse>
): Promise<ApiBaseResponse & { data: AdminFetchAllWhatsappEnquiriesResponse }> => {
  const response = await axiosInstance.post(`/admin/whatsapp-enquiries`, data);
  return response.data;
};

export const adminFetchAllWhatsappEnquiries = async (params?: {
  pagination?: { limit?: number; page?: number };
}): Promise<ApiBaseResponse & { data: AdminFetchAllWhatsappEnquiriesResponse[] }> => {
  const response = await axiosInstance.get(`/admin/whatsapp-enquiries`, {
    params: {
      limit: params?.pagination?.limit,
      page: params?.pagination?.page,
    },
  });
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
  status: "pending" | "contacted" | "under_processing" | "delivered";
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
