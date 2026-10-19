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
  isNewLead?: boolean;
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

export const adminSummarizeLeadComment = async (content: string): Promise<string> => {
  if (!content || !content.trim()) {
    throw new Error("No conversation content provided to summarize.");
  }

  // 1. Try backend endpoint first
  try {
    const response = await axiosInstance.post("/imported-customers/summarize-comment", { content });
    if (response?.data?.data?.summary) {
      return response.data.data.summary;
    }
  } catch (backendError) {
    console.warn("Backend summarization failed, falling back to direct OpenAI API...", backendError);
  }

  // 2. Direct OpenAI fallback
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("AI summarization failed and VITE_OPENAI_API_KEY is not configured.");
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert AI assistant for telecallers at SS HR Consultancy. The telecaller will paste an entire raw conversation, call transcript, or WhatsApp chat with a candidate/lead. Your job is to summarize this conversation into a concise, professional telecaller note (maximum 2-3 sentences or clean bullet points). Highlight: candidate's interest level, qualification/experience, preferred role/location/salary if mentioned, and agreed next steps. Output ONLY the summary without any prefix, quotes, or conversational fluff.",
        },
        {
          role: "user",
          content: content.trim(),
        },
      ],
      temperature: 0.3,
      max_tokens: 250,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenAI summarization failed: ${errorText}`);
  }

  const result = await res.json();
  const summary = result?.choices?.[0]?.message?.content?.trim();
  if (!summary) {
    throw new Error("Empty summary received from AI");
  }
  return summary;
};

