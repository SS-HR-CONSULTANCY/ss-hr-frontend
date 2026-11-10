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

export const adminSummarizeFSSLeadComment = async (
  content: string,
  companyName?: string,
  website?: string
): Promise<string> => {
  if (!content || !content.trim()) {
    throw new Error("No conversation content provided to summarize.");
  }

  // 1. Try backend endpoint first
  try {
    const res = await axiosInstance.post("/admin/full-stack-contacts/summarize-comment", {
      content,
      companyName,
      website,
    });
    if (res?.data?.data?.summary) {
      return res.data.data.summary;
    }
  } catch (err) {
    console.warn("Backend FSS summarization failed, falling back to direct OpenAI...", err);
  }

  // 2. Direct OpenAI fallback
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (apiKey) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              'You are an expert telesales AI assistant for "Full Stack Solutions" (a modern software development and web design agency). The executive contacts business clients (companies, NOT job candidates). Summarize the notes or chat into a professional, concise telesales note (1 to 3 short sentences or clean bullet points). Highlight: client company website/tech status, services discussed (web/app/SEO/CRM), client interest/objections, and agreed next steps. Output ONLY the summary without any prefix or quotes.',
          },
          {
            role: "user",
            content: `Company: ${companyName || "N/A"}\nWebsite: ${website || "N/A"}\nNotes: ${content.trim()}`,
          },
        ],
        max_tokens: 300,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const s = data?.choices?.[0]?.message?.content?.trim();
      if (s) return s.replace(/^#{1,6}\s*/gm, "").trim();
    }
  }

  throw new Error("AI summarization failed. Please check your backend connection or OpenAI key.");
};
