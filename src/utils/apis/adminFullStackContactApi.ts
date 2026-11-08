import { axiosInstance } from "@/lib/axios";

export interface IFSSActivity {
  type: 'status' | 'comment' | 'schedule' | 'assignment';
  from?: string;
  to?: string;
  at: string;
  by?: string;
}

export interface IWebsiteAudit {
  overallHealth?: string;
  issues?: string[];
  report?: string;
  actionItems?: string;
  auditedBy?: string;
  auditedAt?: string;
}

export interface IFullStackContact {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  companyName?: string;
  service?: string;
  state?: string;
  city?: string;
  budget?: string;
  projectDescription?: string;
  website?: string;
  websiteAudit?: IWebsiteAudit;
  status: 'Pending' | 'Contacted' | 'Need Follow Up' | 'In Discussion' | 'Quotation Sent' | 'Converted' | 'Completed' | 'Lost';
  comment?: string;
  scheduledDate?: string;
  scheduledAt?: string;
  assignedTo?: {
    _id: string;
    fullName: string;
    username: string;
    role: string;
  } | null;
  activityLog: IFSSActivity[];
  createdAt: string;
  updatedAt: string;
}

export interface FSSContactsResponse {
  contacts: IFullStackContact[];
  total: number;
  page: number;
  totalPages: number;
  services: string[];
  states: string[];
  stats: {
    total: number;
    pending: number;
    contacted: number;
    needFollowUp: number;
    converted: number;
  };
}

export interface FSSFetchParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  service?: string;
  state?: string;
  assignedTo?: string;
  scheduledDate?: string;
}

export const adminFetchAllFSSContacts = async (params: FSSFetchParams): Promise<FSSContactsResponse> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", params.page.toString());
  if (params.limit) queryParams.set("limit", params.limit.toString());
  if (params.search) queryParams.set("search", params.search);
  if (params.status && params.status !== "all") queryParams.set("status", params.status);
  if (params.service && params.service !== "all") queryParams.set("service", params.service);
  if (params.state && params.state !== "all") queryParams.set("state", params.state);
  if (params.assignedTo && params.assignedTo !== "all") queryParams.set("assignedTo", params.assignedTo);
  if (params.scheduledDate && params.scheduledDate !== "any") queryParams.set("scheduledDate", params.scheduledDate);

  const res = await axiosInstance.get(`/admin/full-stack-contacts?${queryParams.toString()}`);
  return res.data.data;
};

export const adminCreateFSSContact = async (data: Partial<IFullStackContact>): Promise<IFullStackContact> => {
  const res = await axiosInstance.post("/admin/full-stack-contacts", data);
  return res.data.data;
};

export const adminUpdateFSSContact = async (id: string, data: Partial<IFullStackContact>): Promise<IFullStackContact> => {
  const res = await axiosInstance.put(`/admin/full-stack-contacts/${id}`, data);
  return res.data.data;
};

export const adminTelecallFSSContact = async (
  id: string,
  data: {
    status?: string;
    comment?: string;
    scheduledDate?: string;
    scheduledAt?: string;
    website?: string;
    websiteAudit?: IWebsiteAudit;
  }
): Promise<IFullStackContact> => {
  const res = await axiosInstance.patch(`/admin/full-stack-contacts/${id}/telecall`, data);
  return res.data.data;
};

export const adminAssignFSSContact = async (id: string, staffId: string | null): Promise<IFullStackContact> => {
  const res = await axiosInstance.patch(`/admin/full-stack-contacts/${id}/assign`, { staffId });
  return res.data.data;
};

export const adminDeleteFSSContact = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/admin/full-stack-contacts/${id}`);
};

export interface ParsedLead {
  name: string;
  phone: string;
  rating: string;
  reviews: string;
  category: string;
  address: string;
  website: string;
}

export const adminParseFSSLeads = async (text: string): Promise<ParsedLead[]> => {
  const res = await axiosInstance.post("/admin/full-stack-contacts/parse-leads", { text });
  return res.data.data;
};

export const adminBulkCreateFSSContacts = async (
  contacts: Array<Partial<IFullStackContact>>
): Promise<{ created: number; duplicates: number; skippedNoPhone: number }> => {
  const res = await axiosInstance.post("/admin/full-stack-contacts/bulk", { contacts });
  return res.data.data;
};

export const adminFormatAuditReport = async (data: {
  content: string;
  website?: string;
  companyName?: string;
}): Promise<{ formattedReport: string; suggestedPitch: string }> => {
  const res = await axiosInstance.post("/admin/full-stack-contacts/format-audit-report", data);
  return res.data.data;
};
