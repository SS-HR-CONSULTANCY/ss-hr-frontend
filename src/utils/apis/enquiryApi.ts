import { axiosInstance } from "@/lib/axios";

export interface CreateEnquiryRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const submitEnquiry = async (data: CreateEnquiryRequest) => {
  const response = await axiosInstance.post("/enquiry", data);
  return response.data;
};
