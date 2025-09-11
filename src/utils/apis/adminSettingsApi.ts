import type { 
  DeleteAdminRequest, 
  UpdateAdminRequest, 
  CreateAdminResponse, 
  UpdateAdminResponse,
  AdminFetchAllAdminsResponse, 
} from "@/types/apiTypes/adminApiTypes";
import { axiosInstance } from "@/lib/axios";
import type { ApiBaseResponse } from "@/types/commonTypes";

// Create Admin
export const createAdmin = async (payload: FormData): Promise<CreateAdminResponse> => {
  payload.forEach(item =>  console.log(item))
  const response = await axiosInstance.post('/admin/settings/admins', payload);
  return response.data.data;
};

// Fetch Admins
export const fetchAdmins = async (): Promise<AdminFetchAllAdminsResponse> => {
  const response = await axiosInstance.get('/admin/settings/admins');
  return response.data.data;
};

// Update Admin
export const updateAdmin = async (payload: UpdateAdminRequest): Promise<UpdateAdminResponse> => {
  const response = await axiosInstance.patch(`/admin/settings/${payload._id}`, payload);
  return response.data.data;
};

// Delete Admin
export const deleteAdmin = async (payload: DeleteAdminRequest): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.delete(`/admin/settings/${payload._id}`);
  return response.data.data;
};