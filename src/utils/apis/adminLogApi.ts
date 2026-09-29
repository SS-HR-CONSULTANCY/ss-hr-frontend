import { axiosInstance } from "@/lib/axios";

export interface AdminLog {
  _id: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  module: string;
  description: string;
  entityId?: string;
  entityName?: string;
  changes?: Record<string, any>;
  performedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLogStats {
  totalLogs: number;
  actionStats: Array<{ _id: string; count: number }>;
  moduleStats: Array<{ _id: string; count: number }>;
  recentLogs: AdminLog[];
}

export const adminFetchLogs = async (params?: {
  page?: number;
  limit?: number;
  module?: string;
  action?: string;
  search?: string;
}) => {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", params.page.toString());
  if (params?.limit) query.append("limit", params.limit.toString());
  if (params?.module) query.append("module", params.module);
  if (params?.action) query.append("action", params.action);
  if (params?.search) query.append("search", params.search);

  const response = await axiosInstance.get(
    `/admin/logs${query.toString() ? `?${query.toString()}` : ""}`
  );
  return response.data as {
    success: boolean;
    data: AdminLog[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
};

export const adminFetchLogStats = async () => {
  const response = await axiosInstance.get("/admin/logs/stats");
  return response.data as { success: boolean; data: AdminLogStats };
};
