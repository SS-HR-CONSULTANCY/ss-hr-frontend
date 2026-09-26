import { axiosInstance } from "@/lib/axios";
import type { ApiBaseResponse, ApiPaginatedResponse, FetchFunctionParams } from "@/types/commonTypes";
import { buildQueryParams, parseNewCommonResponse } from "@/utils/helpers/apiHelpers";
import type { AdminFetchAllBillsResponse } from "@/types/apiTypes/adminApiTypes";

export const adminFetchAllBills = async (
  params?: FetchFunctionParams,
): Promise<ApiPaginatedResponse<AdminFetchAllBillsResponse>> => {
  const query = buildQueryParams(params);
  const response = await axiosInstance.get(`/admin/bills${query ? `?${query}` : ""}`);
  return parseNewCommonResponse(response.data);
};

export const adminUpdateBill = async (props: {
  enquiryId: string;
  enquiryType: string;
  invoiceAmount?: number;
  currency?: string;
  status?: string;
  comment?: string;
  dueDate?: string;
}): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.patch(`/admin/bills/${props.enquiryId}`, {
    enquiryType: props.enquiryType,
    invoiceAmount: props.invoiceAmount,
    currency: props.currency,
    status: props.status,
    comment: props.comment,
    dueDate: props.dueDate,
  });
  return response.data;
};

export const adminAddBillPayment = async (props: {
  enquiryId: string;
  enquiryType: string;
  date: string;
  amount: number;
}): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.post(`/admin/bills/${props.enquiryId}/payments`, {
    enquiryType: props.enquiryType,
    date: props.date,
    amount: props.amount,
  });
  return response.data;
};
