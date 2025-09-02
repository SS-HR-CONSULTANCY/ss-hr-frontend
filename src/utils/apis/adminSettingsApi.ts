import { axiosInstance } from "@/lib/axios";
import type { 
  AdminGetAboutCurrentDataResponse, 
  AdminGetFooterCurrentDataResponse, 
  AdminGetWebsiteSettingsResponse, 
  AdminUpdateFooterDataRequest, 
  AdminUpdateFooterDataResponse, 
  AdminUpdateWebsiteAboutRequest, 
  AdminUpdateWebsiteAboutResponse, 
  AdminUpdateWebsiteLogoAndNameRequest, 
  AdminUpdateWebsiteLogoAndNameResponse, 
  BlockAdminRequest, BlockAdminResponse, 
  // CreateAdminRequest, 
  CreateAdminResponse, 
  DeleteAdminRequest, 
  AdminFetchAllAdminsResponse, 
  UpdateAdminRequest, 
  UpdateAdminResponse
 } from "@/types/apiTypes/admin";
import type { ApiBaseResponse } from "@/types/commonTypes";

export const adminUpdateWebsiteLogoAndName = async (payload: AdminUpdateWebsiteLogoAndNameRequest): Promise<AdminUpdateWebsiteLogoAndNameResponse> => {
  const formData = new FormData();
  if (payload.companyName) formData.append("companyName", payload.companyName);
  if (payload.logo) formData.append("logo", payload.logo);

  const response = await axiosInstance.patch('/admin/updateWebsiteData', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};

export const adminGetWebsiteCurrentCompanyNameAndLogo = async (): Promise<AdminGetWebsiteSettingsResponse> => {
  const response = await axiosInstance.get('/admin/getWebsiteCurrentData');
  return response.data.data;
};


export const adminUpdateWebsiteFooterData = async (payload: AdminUpdateFooterDataRequest) : Promise<AdminUpdateFooterDataResponse> => {
    const response = await axiosInstance.patch('/admin/updateWebsiteFooterData',payload);
    return response.data.data;
}

export const adminGetWebsiteFooterCurrentData = async (): Promise<AdminGetFooterCurrentDataResponse> => {
  const response = await axiosInstance.get('/admin/getWebsiteFooterCurrentData');
  return response.data.data;
};


export const adminUpdateWebsiteAboutData = async (payload: AdminUpdateWebsiteAboutRequest) : Promise<AdminUpdateWebsiteAboutResponse> => {
    const response = await axiosInstance.patch('/admin/updateWebsiteFooterData',payload);
    return response.data.data;
}

export const adminGetWebsiteAboutCurrentData = async (): Promise<AdminGetAboutCurrentDataResponse> => {
  const response = await axiosInstance.get('/admin/getWebsiteAboutData');
  return response.data.data;
};


// Create Admin
export const createAdmin = async (payload: FormData): Promise<CreateAdminResponse> => {
  payload.forEach(item =>  console.log(item))
  const response = await axiosInstance.post('/admin/createAdmin', payload);
  return response.data.data;
};

// Fetch Admins
export const fetchAdmins = async (): Promise<AdminFetchAllAdminsResponse> => {
  const response = await axiosInstance.get('/admin/getAdmins');
  return response.data.data;
};

// Update Admin
export const updateAdmin = async (payload: UpdateAdminRequest): Promise<UpdateAdminResponse> => {
  const response = await axiosInstance.patch('/admin/updateAdmin', payload);
  return response.data.data;
};

// Block/Unblock Admin
export const blockAdmin = async (payload: BlockAdminRequest): Promise<BlockAdminResponse> => {
  const response = await axiosInstance.patch('/admin/blockAdmin', payload);
  return response.data.data;
};

// Delete Admin
export const deleteAdmin = async (payload: DeleteAdminRequest): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.delete('/admin/deleteAdmin', { data: payload });
  return response.data.data;
};