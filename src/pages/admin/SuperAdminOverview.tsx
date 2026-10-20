import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  Briefcase, 
  Activity, 
  Clock, 
  CheckCircle, 
  Contact, 
  UserCheck, 
  PhoneCall, 
  Calendar, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight,
  Award
} from "lucide-react";

import DataFetchingError from "@/components/common/DataFetchingError";
import GraphShimmer from "@/components/shimmer/GraphShimmer";
import { 
  adminFetchEnquiryAnalyticsData, 
  adminFetchEnquiryStatusDistribution, 
  adminFetchEnquirySummaryStats 
} from "@/utils/apis/adminApi";
import { adminFetchAllCategories } from "@/utils/apis/adminCategoryApi";
import { 
  adminFetchAllPlatformLeads, 
  adminFetchSuperAdminStaffStats, 
  type SuperAdminStaffStatsResponse 
} from "@/utils/apis/adminPlatformLeadsApi";
import { ENQUIRY_STATUS_CONFIG } from "@/utils/enquiryStatusConfig";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Cell, 
  PieChart, 
  Pie, 
  Legend, 
  Tooltip as RechartsTooltip, 
  LabelList,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Navigate, Link } from "react-router-dom";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#F4A460', '#DDA0DD'];
const STAFF_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const SuperAdminOverview: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isTony =
    user?.role === "admin" &&
    (user?.email === "tony" ||
      user?.fullName === "Super Admin" ||
      (user as any)?.username === "tony");

  // If accessed by anyone other than Tony (Super Admin), redirect to standard overview
  if (!isTony) {
    return <Navigate to="/ss-hr-admin/overview" replace />;
  }

  // State for overview analytics
  const [period, setPeriod] = useState<string>("weekly");
  const [status, setStatus] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");

  // Query: Enquiry Analytics Data
  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
    error: analyticsError,
  } = useQuery({
    queryKey: ["enquiryAnalytics", period, status, category],
    queryFn: () => adminFetchEnquiryAnalyticsData(period, status, category),
    refetchOnWindowFocus: false,
  });

  // Query: Categories
  const { data: categoriesData } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: adminFetchAllCategories,
  });
  const categories = categoriesData?.data ?? [];

  // Query: Status Distribution
  const {
    data: statusDistributionData,
    isLoading: isStatusLoading,
  } = useQuery({
    queryKey: ["enquiryStatusDistribution"],
    queryFn: () => adminFetchEnquiryStatusDistribution("all"),
    refetchOnWindowFocus: false,
  });

  // Query: Summary Stats
  const {
    data: summaryStatsData,
    isLoading: isSummaryStatsLoading,
  } = useQuery({
    queryKey: ["enquirySummaryStats"],
    queryFn: adminFetchEnquirySummaryStats,
    refetchOnWindowFocus: false,
  });

  // Query: Total contacts from Platform Leads
  const { data: contactListData } = useQuery({
    queryKey: ["overviewContactListTotal"],
    queryFn: () =>
      adminFetchAllPlatformLeads({
        pagination: { page: 1, limit: 1, scheduledDate: "any" },
      }),
    refetchOnWindowFocus: false,
  });
  const totalContacts = contactListData?.stats?.total ?? contactListData?.totalCount ?? 0;

  // Query: Super Admin Staff Stats
  const {
    data: staffStatsData,
    isLoading: isStaffStatsLoading,
  } = useQuery<SuperAdminStaffStatsResponse>({
    queryKey: ["superAdminStaffStats"],
    queryFn: adminFetchSuperAdminStaffStats,
    refetchOnWindowFocus: false,
  });

  // Memoized Pie Data for Enquiries
  const pieData = React.useMemo(() => {
    if (!statusDistributionData) return [];
    
    let pendingCount = 0;
    let completedCount = 0;
    let otherCount = 0;
    
    statusDistributionData.forEach(item => {
      if (item.status === 'pending') {
        pendingCount += item.count;
      } else if (item.status === 'completed') {
        completedCount += item.count;
      } else if (item.status !== 'not_interested' && item.status !== 'rejected_application') {
        otherCount += item.count;
      }
    });
    
    return [
      { name: 'Pending', value: pendingCount, color: '#ef4444' },
      { name: 'Completed', value: completedCount, color: '#22c55e' },
      { name: 'In Progress', value: otherCount, color: '#eab308' },
    ].filter(item => item.value > 0);
  }, [statusDistributionData]);

  // Staff Comparison Bar Chart Data
  const staffChartData = React.useMemo(() => {
    if (!staffStatsData?.staffStats) return [];
    return staffStatsData.staffStats.map((s) => ({
      name: s.fullName.split(' ')[0] || s.username,
      fullName: s.fullName,
      assigned: s.totalAssigned,
      contacted: s.contacted,
      completed: s.completed,
      pending: s.pending,
      needFollowUp: s.needFollowUp,
    }));
  }, [staffStatsData]);

  const chartConfig = {
    count: {
      label: "Enquiries",
      color: "#3b82f6",
    },
  };

  return (
    <div className="space-y-8 text-black dark:text-white mt-0 w-full pb-14">
      {/* ======================================================== */}
      {/* 1. STAFF SEPARATE STATS SECTION (EXCLUSIVE TO SUPER ADMIN) */}
      {/* ======================================================== */}
      <div className="space-y-4">
        {/* Staff Performance & Workload Section */}
        {isStaffStatsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GraphShimmer count={1} />
            </div>
            <div className="lg:col-span-1">
              <GraphShimmer count={1} />
            </div>
          </div>
        ) : staffStatsData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Side: Header + 4 KPI Cards + Workload Comparison Chart */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 h-10">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    Staff Telecalling Performance & Lead Distribution
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                      Super Admin Only
                    </span>
                  </h2>
                </div>
              </div>

              {/* 4 Stats Cards in Single Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Card className="bg-gradient-to-br from-indigo-50/60 to-white dark:from-indigo-950/20 dark:to-gray-900 border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between p-3 pb-1 space-y-0">
                    <CardTitle className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider truncate pr-1">Total Assigned</CardTitle>
                    <div className="p-1.5 rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 shrink-0">
                      <UserCheck className="w-3.5 h-3.5" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-xl font-bold text-indigo-700 dark:text-indigo-300">
                      {staffStatsData.overall.totalAssigned}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                      {staffStatsData.overall.activeStaffCount} active staff
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50/60 to-white dark:from-blue-950/20 dark:to-gray-900 border-blue-100 dark:border-blue-900/50 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between p-3 pb-1 space-y-0">
                    <CardTitle className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider truncate pr-1">Contacted</CardTitle>
                    <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-600 shrink-0">
                      <PhoneCall className="w-3.5 h-3.5" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-xl font-bold text-blue-700 dark:text-blue-300">
                      {staffStatsData.staffStats.reduce((acc, s) => acc + s.contacted, 0)}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">Calls initiated</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-50/60 to-white dark:from-emerald-950/20 dark:to-gray-900 border-emerald-100 dark:border-emerald-900/50 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between p-3 pb-1 space-y-0">
                    <CardTitle className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider truncate pr-1">Converted</CardTitle>
                    <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 shrink-0">
                      <Award className="w-3.5 h-3.5" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                      {staffStatsData.staffStats.reduce((acc, s) => acc + s.completed, 0)}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5 truncate">Closed leads</p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-50/60 to-white dark:from-amber-950/20 dark:to-gray-900 border-amber-100 dark:border-amber-900/50 shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between p-3 pb-1 space-y-0">
                    <CardTitle className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider truncate pr-1">Unassigned</CardTitle>
                    <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-600 shrink-0">
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="text-xl font-bold text-amber-700 dark:text-amber-400">
                      {staffStatsData.overall.totalUnassigned}
                    </div>
                    <Link
                      to="/ss-hr-admin/platform-leads"
                      className="text-[10px] font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-0.5 mt-0.5 truncate"
                    >
                      Assign now <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </CardContent>
                </Card>
              </div>

              {/* Visual Staff Workload Comparison Chart */}
              {staffStatsData.staffStats.length > 0 && (
                <Card className="shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-semibold">Staff Workload & Conversion Comparison</CardTitle>
                        <CardDescription className="text-xs">
                          Compare total assigned leads against contacted and converted counts per staff member
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={staffChartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                          <CartesianGrid vertical={false} strokeDasharray="3 3" />
                          <XAxis dataKey="name" tickLine={false} axisLine={false} />
                          <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                          <RechartsTooltip />
                          <Legend />
                          <Bar dataKey="assigned" name="Assigned" fill="#6366f1" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="contacted" name="Contacted" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Side: Staff Performance Breakdown starting from top right at SAME LEVEL */}
            {staffStatsData.staffStats.length > 0 && (
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center justify-between h-10">
                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                    Staff Performance Breakdown
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200">
                    {staffStatsData.staffStats.length} Staff
                  </span>
                </div>
                <div className="space-y-3">
                  {staffStatsData.staffStats.map((staff, idx) => (
                    <Card key={staff.staffId} className="border-l-4 shadow-sm hover:shadow-md transition-all" style={{ borderLeftColor: STAFF_COLORS[idx % STAFF_COLORS.length] }}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs"
                              style={{ backgroundColor: STAFF_COLORS[idx % STAFF_COLORS.length] }}
                            >
                              {staff.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{staff.fullName}</h4>
                              <p className="text-xs text-gray-400 font-mono">@{staff.username}</p>
                            </div>
                          </div>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200">
                            {staff.totalAssigned} Leads
                          </span>
                        </div>

                        {/* Progress Metrics */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                            <span>Contact Rate:</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{staff.contactRate}%</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(staff.contactRate, 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Status Badges Grid */}
                        <div className="grid grid-cols-3 gap-1.5 pt-1 text-center">
                          <div className="p-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/50">
                            <span className="block text-[10px] text-yellow-700 dark:text-yellow-400 font-medium">Pending</span>
                            <span className="font-bold text-xs text-yellow-800 dark:text-yellow-300">{staff.pending}</span>
                          </div>
                          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
                            <span className="block text-[10px] text-blue-700 dark:text-blue-400 font-medium">Contacted</span>
                            <span className="font-bold text-xs text-blue-800 dark:text-blue-300">{staff.contacted}</span>
                          </div>
                          <div className="p-1.5 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50">
                            <span className="block text-[10px] text-green-700 dark:text-green-400 font-medium">Completed</span>
                            <span className="font-bold text-xs text-green-800 dark:text-green-300">{staff.completed}</span>
                          </div>
                        </div>

                        {staff.missedFollowUp > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 px-2.5 py-1 rounded-md">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>{staff.missedFollowUp} missed follow-up(s)</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800 my-6" />

      {/* ======================================================== */}
      {/* 2. ALL ITEMS FROM CURRENT OVERVIEW PAGE */}
      {/* ======================================================== */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Overall Platform Analytics</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Complete customer enquiries, application stages, and scheduled follow-ups.
            </p>
          </div>
        </div>

        {/* Stats Cards Row */}
        {isSummaryStatsLoading ? (
          <div className="w-full">
            <GraphShimmer count={1} />
          </div>
        ) : summaryStatsData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 w-full">
            <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900 shadow-sm transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Enquiries</CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{summaryStatsData.total}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50/50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900 shadow-sm transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Visiting Package Enquiries</CardTitle>
                <Briefcase className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">{summaryStatsData.visitingPackage}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-100 dark:border-yellow-900 shadow-sm transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">In Progress</CardTitle>
                <Activity className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">{summaryStatsData.inProgress}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900 shadow-sm transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending to contact</CardTitle>
                <Clock className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{summaryStatsData.pending}</div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50/50 dark:bg-green-950/20 border-green-100 dark:border-green-900 shadow-sm transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{summaryStatsData.completed}</div>
              </CardContent>
            </Card>

            <Card className="bg-cyan-50/50 dark:bg-cyan-950/20 border-cyan-100 dark:border-cyan-900 shadow-sm transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Leads</CardTitle>
                <Contact className="h-4 w-4 text-cyan-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-400">{totalContacts}</div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Charts: Enquiry Trends and Follow-up Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mt-2">
          <Card className="w-full lg:col-span-2">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-medium">Enquiry Trends</CardTitle>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-[170px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <SelectValue placeholder="Select Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly (Yearly)</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[180px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {Object.entries(ENQUIRY_STATUS_CONFIG).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[180px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((c: any) => (
                      <SelectItem key={c._id} value={c.name}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isAnalyticsLoading ? (
                <div className="w-full mt-4">
                  <GraphShimmer count={1} />
                </div>
              ) : isAnalyticsError ? (
                <DataFetchingError
                  message={"Failed to fetch analytics data: " + (analyticsError as Error).message}
                  className="bg-gray-200 dark:bg-gray-600 rounded-md text-red-500 mt-4"
                />
              ) : analyticsData ? (
                (() => {
                  let displayData = [];
                  const now = new Date();

                  if (period === 'weekly') {
                    const dayOfWeek = now.getDay();
                    const diffToMonday = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                    
                    for (let i = 0; i < 7; i++) {
                      const d = new Date(now.getFullYear(), now.getMonth(), diffToMonday + i);
                      const dateStr = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`;
                      const found = analyticsData?.find(item => item.date === dateStr);
                      
                      displayData.push({
                        date: dateStr,
                        dayName: days[i],
                        count: found ? found.count : 0
                      });
                    }
                  } else if (period === 'monthly') {
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    for (let i = 0; i < 12; i++) {
                      const monthStr = `${now.getFullYear()}-${(i + 1).toString().padStart(2, '0')}`;
                      const found = analyticsData?.find(item => item.date === monthStr);
                      
                      displayData.push({
                        date: monthStr,
                        dayName: months[i],
                        count: found ? found.count : 0
                      });
                    }
                  }

                  return (
                    <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full mt-4">
                      <BarChart
                        accessibilityLayer
                        data={displayData}
                        margin={{
                          left: 0,
                          right: 20,
                          top: 20,
                          bottom: 20
                        }}
                      >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                          dataKey="dayName"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={10}
                        />
                        <YAxis 
                          tickLine={false}
                          axisLine={false}
                          tickMargin={10}
                          allowDecimals={false}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="count"
                          radius={[4, 4, 0, 0]}
                        >
                          <LabelList dataKey="count" position="top" fill="currentColor" offset={10} fontSize={12} />
                          {
                            displayData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))
                          }
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  );
                })()
              ) : (
                <div className="flex items-center justify-center min-h-[300px]">
                  <p className="text-slate-500">No analytics data available for the selected filters.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="w-full lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Lead Follow Up Status</CardTitle>
            </CardHeader>
            <CardContent>
              {isStatusLoading ? (
                <div className="w-full mt-4 flex items-center justify-center min-h-[300px]">
                  <p>Loading...</p>
                </div>
              ) : pieData.length > 0 ? (
                <div className="h-[300px] w-full flex items-center justify-center mt-4">
                  <PieChart width={300} height={300}>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      labelLine={false}
                      label={({ percent }) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(value: number) => [`${value} Enquiries`, 'Count']}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-[300px]">
                  <p className="text-slate-500">No status data available.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminOverview;
