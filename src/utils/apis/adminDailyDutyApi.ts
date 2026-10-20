import { axiosInstance } from "@/lib/axios";

export type DutyPriority = "low" | "medium" | "high" | "urgent";
export type DutyStatus = "pending" | "in_progress" | "stuck" | "completed" | "validated" | "cancelled";
export type DutyCategory =
  | "telecalling"
  | "client_followup"
  | "documentation"
  | "full_stack"
  | "data_entry"
  | "operations"
  | "marketing"
  | "other";

export interface IDutyUser {
  _id: string;
  fullName: string;
  username: string;
  role: "admin" | "staff";
}

export interface IDutyComment {
  _id?: string;
  senderId: string;
  senderName: string;
  senderRole: "admin" | "staff";
  text: string;
  createdAt: string;
}

export interface IDailyDuty {
  _id: string;
  title: string;
  description: string;
  assignedTo: IDutyUser;
  assignedBy?: IDutyUser;
  dutyDate: string; // YYYY-MM-DD
  deadlineTime?: string;
  deadline?: string;
  priority: DutyPriority;
  category: DutyCategory;
  targetCount?: number;
  completedCount: number;
  status: DutyStatus;
  progress: number;
  isCarriedForward?: boolean;
  originalDutyDate?: string;
  carriedForwardFrom?: string;
  carriedForwardAt?: string;
  stuckInfo?: {
    isStuck: boolean;
    reason?: string;
    stuckAt?: string;
    resolvedAt?: string;
  };
  completionInfo?: {
    completedAt?: string;
    notes?: string;
    proofLink?: string;
  };
  validationInfo?: {
    isValidated: boolean;
    validatedBy?: IDutyUser;
    validatedAt?: string;
    rating?: number;
    feedback?: string;
  };
  comments: IDutyComment[];
  createdAt: string;
  updatedAt: string;
}

export interface IDailyDutyStats {
  total: number;
  pending: number;
  inProgress: number;
  stuck: number;
  completed: number;
  validated: number;
  overdue: number;
}

export interface DailyDutiesResponse {
  duties: IDailyDuty[];
  total: number;
  stats: IDailyDutyStats;
}

export interface IDailyReport {
  _id: string;
  staffId: IDutyUser;
  date: string;
  summary: string;
  challenges?: string;
  tomorrowPlan?: string;
  stats?: {
    totalAssigned: number;
    totalCompleted: number;
    totalValidated: number;
    totalStuck: number;
    completionRate: number;
  };
  status: "draft" | "submitted" | "reviewed";
  adminFeedback?: string;
  reviewedBy?: IDutyUser;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyReportSummaryResponse {
  date: string;
  reports: IDailyReport[];
  staffDutyMetrics: Record<
    string,
    {
      total: number;
      pending: number;
      inProgress: number;
      stuck: number;
      completed: number;
      validated: number;
    }
  >;
}

export interface FetchDutiesParams {
  date?: string; // YYYY-MM-DD or 'all'
  staffId?: string;
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
}

// Fetch all staff & admins for dropdowns
export const adminFetchStaffMembers = async (): Promise<IDutyUser[]> => {
  const res = await axiosInstance.get("/admin/daily-duties/staff-members");
  return res.data?.data || [];
};

// Fetch duties with filters & stats
export const adminFetchDailyDuties = async (params: FetchDutiesParams = {}): Promise<DailyDutiesResponse> => {
  const today = new Date().toISOString().split("T")[0];
  const res = await axiosInstance.get("/admin/daily-duties", { params: { today, ...params } });
  return res.data?.data || { duties: [], total: 0, stats: { total: 0, pending: 0, inProgress: 0, stuck: 0, completed: 0, validated: 0, overdue: 0 } };
};

// Fetch pending and stuck duties count for badges
export const adminFetchDailyDutiesPendingCount = async (): Promise<{ pendingCount: number; stuckCount: number }> => {
  const today = new Date().toISOString().split("T")[0];
  const res = await axiosInstance.get("/admin/daily-duties/pending-count", {
    params: { today }
  });
  return res.data?.data || { pendingCount: 0, stuckCount: 0 };
};

// Create a new duty (single or multi-staff assignment)
export const adminCreateDailyDuty = async (payload: {
  title: string;
  description?: string;
  assignedTo?: string;
  assignedToStaffIds?: string[];
  dutyDate?: string;
  deadlineTime?: string;
  priority?: DutyPriority;
  category?: DutyCategory;
  targetCount?: number;
}): Promise<IDailyDuty[]> => {
  const res = await axiosInstance.post("/admin/daily-duties", payload);
  return res.data?.data;
};

// Update duty details
export const adminUpdateDailyDuty = async (
  id: string,
  payload: Partial<{
    title: string;
    description: string;
    assignedTo: string;
    dutyDate: string;
    deadlineTime: string;
    priority: DutyPriority;
    category: DutyCategory;
    targetCount: number;
    completedCount: number;
  }>
): Promise<IDailyDuty> => {
  const res = await axiosInstance.put(`/admin/daily-duties/${id}`, payload);
  return res.data?.data;
};

// Update progress, completed count, or submission notes
export const adminUpdateDutyProgress = async (
  id: string,
  payload: {
    progress?: number;
    completedCount?: number;
    status?: DutyStatus;
    notes?: string;
    proofLink?: string;
  }
): Promise<IDailyDuty> => {
  const res = await axiosInstance.patch(`/admin/daily-duties/${id}/progress`, payload);
  return res.data?.data;
};

// Report or resolve a blocker ("Stuck")
export const adminReportDutyStuck = async (
  id: string,
  payload: {
    isStuck: boolean;
    reason?: string;
  }
): Promise<IDailyDuty> => {
  const res = await axiosInstance.patch(`/admin/daily-duties/${id}/stuck`, payload);
  return res.data?.data;
};

// Validate / Approve duty (Admin)
export const adminValidateDuty = async (
  id: string,
  payload: {
    isValidated: boolean;
    feedback?: string;
    rating?: number;
  }
): Promise<IDailyDuty> => {
  const res = await axiosInstance.patch(`/admin/daily-duties/${id}/validate`, payload);
  return res.data?.data;
};

// Add comment to duty discussion
export const adminAddDutyComment = async (id: string, text: string): Promise<IDailyDuty> => {
  const res = await axiosInstance.post(`/admin/daily-duties/${id}/comment`, { text });
  return res.data?.data;
};

// Delete a duty
export const adminDeleteDailyDuty = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/admin/daily-duties/${id}`);
};

// Fetch daily reports summary for a date
export const adminFetchDailyReportSummary = async (date: string, staffId?: string): Promise<DailyReportSummaryResponse> => {
  const res = await axiosInstance.get("/admin/daily-duties/reports/daily", {
    params: { date, staffId },
  });
  return res.data?.data || { date, reports: [], staffDutyMetrics: {} };
};

// Submit End-Of-Day Daily Report
export const adminSubmitDailyReport = async (payload: {
  date: string;
  summary: string;
  challenges?: string;
  tomorrowPlan?: string;
}): Promise<IDailyReport> => {
  const res = await axiosInstance.post("/admin/daily-duties/reports/daily", payload);
  return res.data?.data;
};

// Review Daily Report (Admin feedback)
export const adminReviewDailyReport = async (
  reportId: string,
  payload: { adminFeedback: string }
): Promise<IDailyReport> => {
  const res = await axiosInstance.patch(`/admin/daily-duties/reports/${reportId}/review`, payload);
  return res.data?.data;
};
