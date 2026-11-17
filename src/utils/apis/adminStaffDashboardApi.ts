import { axiosInstance } from "@/lib/axios";

export interface StaffDashboardData {
  staff: { _id: string; fullName?: string; username?: string };
  kpis: {
    totalLeads: number;
    pending: number;
    followUpsToday: number;
    missedFollowUps: number;
    converted: number;
    lost: number;
    conversionRate: number;
    actionsToday: number;
    dutiesToday: { total: number; completed: number };
  };
  statusBreakdown: { status: string; fss: number; platform: number; total: number }[];
  activityByDay: { date: string; fss: number; platform: number }[];
  followUps: {
    name: string;
    source: string;
    status: string;
    scheduledDate: string;
    overdue: boolean;
  }[];
  recentActivities: {
    source: string;
    leadName: string;
    type: string;
    from: string;
    to: string;
    at: string;
  }[];
}

export const fetchStaffDashboard = async (staffId?: string): Promise<StaffDashboardData> => {
  const res = await axiosInstance.get("/admin/staff-dashboard", {
    params: staffId ? { staffId } : undefined,
  });
  return res.data.data;
};
