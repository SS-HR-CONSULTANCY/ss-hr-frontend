import type { 
  UpdateAdminRequest, 
  CreateAdminResponse, 
  UpdateAdminResponse,
  AdminFetchAllAdminsResponse, 
} from "@/types/apiTypes/adminApiTypes";
import { axiosInstance } from "@/lib/axios";
import type { ApiBaseResponse, ApiPaginatedResponse, FetchFunctionParams } from "@/types/commonTypes";
import { buildQueryParams, parseNewCommonResponse } from "../helpers/apiHelpers";

// Create Admin
export const createAdmin = async (payload: FormData): Promise<CreateAdminResponse> => {
  payload.forEach(item =>  console.log(item))
  const response = await axiosInstance.post('/admin/settings/admins', payload);
  return response.data.data;
};

// Fetch Admins
export const fetchAdmins = async (params?: FetchFunctionParams): Promise<ApiPaginatedResponse<AdminFetchAllAdminsResponse>> => {
  const query = buildQueryParams(params);
  const response = await axiosInstance.get(`/admin/settings/admins${query ? `?${query}` : ''}`);
  return parseNewCommonResponse<AdminFetchAllAdminsResponse>(response.data.data);
};

// Update Admin
export const updateAdmin = async (payload: UpdateAdminRequest): Promise<UpdateAdminResponse> => {
  const response = await axiosInstance.patch(`/admin/settings/${payload._id}`, payload);
  return response.data.data;
};

// Delete Admin
export const deleteAdmin = async (adminId: string): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.delete(`/admin/settings/${adminId}`);
  return response.data;
};