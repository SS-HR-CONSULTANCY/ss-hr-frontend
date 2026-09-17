import { axiosInstance } from "@/lib/axios";
import type { ApiBaseResponse } from "@/types/commonTypes";
import type { AccountResponse } from "@/types/apiTypes/adminApiTypes";

export const adminFetchAllAccounts = async (): Promise<ApiBaseResponse & { data: AccountResponse[] }> => {
  const response = await axiosInstance.get("/admin/accounts");
  return response.data;
};

export const adminCreateAccount = async (name: string): Promise<ApiBaseResponse & { data: AccountResponse }> => {
  const response = await axiosInstance.post("/admin/accounts", { name });
  return response.data;
};

export const adminUpdateAccount = async (id: string, name: string): Promise<ApiBaseResponse & { data: AccountResponse }> => {
  const response = await axiosInstance.put(`/admin/accounts/${id}`, { name });
  return response.data;
};

export const adminDeleteAccount = async (id: string): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.delete(`/admin/accounts/${id}`);
  return response.data;
};
