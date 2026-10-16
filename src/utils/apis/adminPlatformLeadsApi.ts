import { axiosInstance } from "@/lib/axios";
import { buildQueryParams } from "../helpers/apiHelpers";
import type { FetchFunctionParams, ApiPaginatedResponse } from "@/types/commonTypes";

export interface AssignedStaff {
  _id: string;
  fullName: string;
  username: string;
  role: string;
}

export interface ImportedCustomerActivity {
  type: "status" | "comment" | "schedule" | "state" | "assignment";
  from?: string;
  to?: string;
  at: string;
}

export interface ImportedCustomer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  designations: string[];
  cvUrl: string;
  linkedinUrl?: string;
  source: string;
  status: string;
  comment: string;
  scheduledDate?: string;
  assignedTo?: AssignedStaff | string | null;
  activityLog?: ImportedCustomerActivity[];
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
    stats: resData.stats,
    states: resData.states,
  };
};

export const adminUpdatePlatformLead = async (
  id: string,
  payload: {
    status?: string;
    comment?: string;
    scheduledDate?: string;
    state?: string;
    assignedTo?: string | null;
  }
): Promise<ImportedCustomer> => {
  const response = await axiosInstance.patch(`/imported-customers/${id}/telecall`, payload);
  return response.data.data;
};

export const adminAssignPlatformLead = async (
  id: string,
  staffId: string | null
): Promise<ImportedCustomer> => {
  const response = await axiosInstance.patch(`/imported-customers/${id}/assign`, { staffId });
  return response.data.data;
};

export const adminFetchSystemStaff = async (): Promise<AssignedStaff[]> => {
  const response = await axiosInstance.get("/admin/system-users");
  const users: any[] = response.data.data || [];
  return users.filter((u) => u.role === "staff" && u.isActive !== false);
};
