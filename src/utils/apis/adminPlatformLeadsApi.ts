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

export interface StaffStatItem {
  staffId: string;
  fullName: string;
  username: string;
  isActive: boolean;
  totalAssigned: number;
  pending: number;
  contacted: number;
  needFollowUp: number;
  processingApplication: number;
  completed: number;
  rejectedApplication: number;
  notInterested: number;
  scheduledToday: number;
  missedFollowUp: number;
  contactRate: number;
  conversionRate: number;
}

export interface SuperAdminStaffStatsResponse {
  overall: {
    totalLeads: number;
    totalAssigned: number;
    totalUnassigned: number;
    activeStaffCount: number;
  };
  staffStats: StaffStatItem[];
  unassignedStats: {
    total: number;
    pending: number;
    contacted: number;
    needFollowUp: number;
    completed: number;
    scheduledToday: number;
    missedFollowUp: number;
  };
}

export const adminFetchSuperAdminStaffStats = async (): Promise<SuperAdminStaffStatsResponse> => {
  const response = await axiosInstance.get("/imported-customers/staff-stats");
  return response.data.data;
};
