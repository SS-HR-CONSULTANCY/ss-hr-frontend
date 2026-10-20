import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  ListTodo,
  Plus,
  Search,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  Send,
  User,
  Star,
  TrendingUp,
  X,
  Edit2,
  Trash2,
  RotateCcw,
  ExternalLink,
} from "lucide-react";

import {
  adminFetchDailyDuties,
  adminCreateDailyDuty,
  adminUpdateDailyDuty,
  adminUpdateDutyProgress,
  adminReportDutyStuck,
  adminValidateDuty,
  adminAddDutyComment,
  adminDeleteDailyDuty,
  adminFetchStaffMembers,
} from "@/utils/apis/adminDailyDutyApi";
import type {
  IDailyDuty,
  DutyStatus,
} from "@/utils/apis/adminDailyDutyApi";

const STATUS_CONFIG: Record<DutyStatus, { label: string; badge: string; dot: string }> = {
  pending: { label: "To Do", badge: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-900/40", dot: "bg-yellow-400" },
  in_progress: { label: "In Progress", badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/40", dot: "bg-blue-500 animate-pulse" },
  stuck: { label: "Stuck / Blocked", badge: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800", dot: "bg-rose-600 animate-ping" },
  completed: { label: "Completed", badge: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/40", dot: "bg-purple-500" },
  validated: { label: "Validated", badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40", dot: "bg-emerald-500" },
  cancelled: { label: "Cancelled", badge: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700", dot: "bg-gray-400" },
};

const STUCK_PRESETS = [
  "Client not answering / unreachable",
  "CRM or platform technical issue",
  "Awaiting Admin approval / pricing confirmation",
  "Missing client documents or details",
  "Client requested callback later",
  "Payment verification pending",
  "Other blocker (specify in notes)",
];

const getTodayString = () => new Date().toISOString().split("T")[0];

const DailyDutiesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === "admin";

  // Filters State
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [selectedStaffId, setSelectedStaffId] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals & Drawers State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isStuckModalOpen, setIsStuckModalOpen] = useState(false);
  const [isValidateModalOpen, setIsValidateModalOpen] = useState(false);
  const [isCommentsDrawerOpen, setIsCommentsDrawerOpen] = useState(false);

  // Active item selections
  const [activeDuty, setActiveDuty] = useState<IDailyDuty | null>(null);

  // Form States
  const [assignForm, setAssignForm] = useState({
    title: "",
    description: "",
    assignedToStaffIds: [] as string[],
    dutyDate: getTodayString(),
    deadlineTime: "18:00",
    targetCount: 0,
  });

  const [editForm, setEditForm] = useState({
    id: "",
    title: "",
    description: "",
    assignedTo: "",
    dutyDate: "",
    deadlineTime: "",
    targetCount: 0,
    completedCount: 0,
  });

  const [progressForm, setProgressForm] = useState({
    progress: 0,
    completedCount: 0,
    status: "in_progress" as DutyStatus,
    notes: "",
    proofLink: "",
  });

  const [stuckReason, setStuckReason] = useState("");
  const [validationForm, setValidationForm] = useState({
    isValidated: true,
    feedback: "",
    rating: 5,
  });

  const [newCommentText, setNewCommentText] = useState("");

  // Fetch Staff Members
  const { data: staffMembers = [] } = useQuery({
    queryKey: ["adminStaffMembers"],
    queryFn: adminFetchStaffMembers,
  });

  // Fetch Duties
  const { data: dutiesData, isLoading: isLoadingDuties } = useQuery({
    queryKey: [
      "daily-duties",
      selectedDate,
      selectedStaffId,
      statusFilter,
      searchQuery,
    ],
    queryFn: () =>
      adminFetchDailyDuties({
        date: selectedDate,
        staffId: selectedStaffId,
        status: statusFilter,
        search: searchQuery,
      }),
  });

  const duties = dutiesData?.duties || [];
  const stats = dutiesData?.stats || {
    total: 0,
    pending: 0,
    inProgress: 0,
    stuck: 0,
    completed: 0,
    validated: 0,
    overdue: 0,
  };

  // Mutations
  const createDutyMutation = useMutation({
    mutationFn: adminCreateDailyDuty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-duties"] });
      queryClient.invalidateQueries({ queryKey: ["dailyDutyPendingCount"] });
      queryClient.invalidateQueries({ queryKey: ["adminStuckDutiesCount"] });
      toast.success("Daily duty assigned successfully");
      setIsAssignModalOpen(false);
      resetAssignForm();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to assign duty");
    },
  });

  const updateDutyMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => adminUpdateDailyDuty(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-duties"] });
      queryClient.invalidateQueries({ queryKey: ["dailyDutyPendingCount"] });
      toast.success("Duty details updated");
      setIsEditModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update duty");
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => adminUpdateDutyProgress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-duties"] });
      queryClient.invalidateQueries({ queryKey: ["dailyDutyPendingCount"] });
      toast.success("Duty progress updated");
      setIsProgressModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update progress");
    },
  });

  const stuckMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => adminReportDutyStuck(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["daily-duties"] });
      queryClient.invalidateQueries({ queryKey: ["dailyDutyPendingCount"] });
      queryClient.invalidateQueries({ queryKey: ["adminStuckDutiesCount"] });
      toast.success(variables.payload.isStuck ? "Blocker reported to Admin" : "Blocker resolved!");
      setIsStuckModalOpen(false);
      setStuckReason("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update blocker status");
    },
  });

  const validateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => adminValidateDuty(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["daily-duties"] });
      queryClient.invalidateQueries({ queryKey: ["dailyDutyPendingCount"] });
      toast.success(variables.payload.isValidated ? "Duty verified & approved!" : "Revision requested");
      setIsValidateModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to validate duty");
    },
  });

  const commentMutation = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) => adminAddDutyComment(id, text),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["daily-duties"] });
      queryClient.invalidateQueries({ queryKey: ["dailyDutyPendingCount"] });
      setActiveDuty(updated);
      setNewCommentText("");
      toast.success("Comment posted");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to post comment");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteDailyDuty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["daily-duties"] });
      queryClient.invalidateQueries({ queryKey: ["dailyDutyPendingCount"] });
      queryClient.invalidateQueries({ queryKey: ["adminStuckDutiesCount"] });
      toast.success("Duty deleted");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete duty");
    },
  });

  // Handlers
  const resetAssignForm = () => {
    setAssignForm({
      title: "",
      description: "",
      assignedToStaffIds: [],
      dutyDate: selectedDate !== "all" ? selectedDate : getTodayString(),
      deadlineTime: "18:00",
      targetCount: 0,
    });
  };

  const handleOpenAssign = () => {
    resetAssignForm();
    setIsAssignModalOpen(true);
  };

  const handleOpenEdit = (duty: IDailyDuty) => {
    setActiveDuty(duty);
    setEditForm({
      id: duty._id,
      title: duty.title,
      description: duty.description || "",
      assignedTo: (duty.assignedTo as any)?._id || "",
      dutyDate: duty.dutyDate,
      deadlineTime: duty.deadlineTime || "",
      targetCount: duty.targetCount || 0,
      completedCount: duty.completedCount || 0,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenProgress = (duty: IDailyDuty) => {
    setActiveDuty(duty);
    setProgressForm({
      progress: duty.progress || 0,
      completedCount: duty.completedCount || 0,
      status: duty.status === "completed" ? "completed" : "in_progress",
      notes: duty.completionInfo?.notes || "",
      proofLink: duty.completionInfo?.proofLink || "",
    });
    setIsProgressModalOpen(true);
  };

  const handleOpenStuck = (duty: IDailyDuty) => {
    setActiveDuty(duty);
    setStuckReason(duty.stuckInfo?.reason || "");
    setIsStuckModalOpen(true);
  };

  const handleOpenValidate = (duty: IDailyDuty) => {
    setActiveDuty(duty);
    setValidationForm({
      isValidated: true,
      feedback: duty.validationInfo?.feedback || "",
      rating: duty.validationInfo?.rating || 5,
    });
    setIsValidateModalOpen(true);
  };

  const handleOpenComments = (duty: IDailyDuty) => {
    setActiveDuty(duty);
    setIsCommentsDrawerOpen(true);
  };

  const handleDateQuickShift = (shiftDays: number) => {
    const base = selectedDate === "all" ? new Date() : new Date(selectedDate);
    base.setDate(base.getDate() + shiftDays);
    setSelectedDate(base.toISOString().split("T")[0]);
  };

  // Helper for deadline countdown
  const getDeadlineText = (deadline?: string, deadlineTime?: string): { isOverdue?: boolean; isDueSoon?: boolean; text: string } => {
    if (!deadline) return { text: deadlineTime ? `By ${deadlineTime}` : "No deadline set" };
    const d = new Date(deadline);
    const now = new Date();
    const diffMs = d.getTime() - now.getTime();
    const diffMin = Math.round(diffMs / (1000 * 60));

    if (diffMin < 0) {
      const overdueHrs = Math.abs(Math.floor(diffMin / 60));
      const overdueMins = Math.abs(diffMin % 60);
      return {
        isOverdue: true,
        text: `Overdue by ${overdueHrs > 0 ? `${overdueHrs}h ` : ""}${overdueMins}m`,
      };
    }
    if (diffMin <= 120) {
      return {
        isDueSoon: true,
        text: `Due in ${diffMin} mins`,
      };
    }
    const hrs = Math.floor(diffMin / 60);
    return {
      text: `Due in ${hrs}h (${deadlineTime || d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`,
    };
  };

  // Check if there are any stuck duties today
  const stuckDuties = useMemo(() => duties.filter((d) => d.status === "stuck"), [duties]);

  return (
    <div className="space-y-5 text-black dark:text-white mt-0 w-full pb-20">
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-900 shadow-xs">
            <ListTodo className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Staff Daily Duties
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300">
                {isAdmin ? "Super Admin & Team" : "My Work Pipeline"}
              </span>
            </div>
          </div>
        </div>

        {/* Date Controls & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Date Switcher */}
          <div className="inline-flex items-center rounded-lg bg-gray-100 dark:bg-gray-800 p-1 text-xs">
            <button
              onClick={() => handleDateQuickShift(-1)}
              className="px-2 py-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition"
              title="Previous Day"
            >
              &larr; Prev
            </button>
            <button
              onClick={() => setSelectedDate(getTodayString())}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                selectedDate === getTodayString()
                  ? "bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-xs"
                  : "text-gray-600 dark:text-gray-300"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => handleDateQuickShift(1)}
              className="px-2 py-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 transition"
              title="Next Day"
            >
              Next &rarr;
            </button>
          </div>

          {/* Date Picker Input */}
          <div className="relative flex items-center">
            <input
              type="date"
              value={selectedDate === "all" ? "" : selectedDate}
              onChange={(e) => setSelectedDate(e.target.value || getTodayString())}
              className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          {/* Admin: Assign Daily Duty Button */}
          {isAdmin && (
            <button
              onClick={handleOpenAssign}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              Assign Daily Duty
            </button>
          )}
        </div>
      </div>

      {/* Stuck Alert Banner - High visibility unblock alert */}
      {stuckDuties.length > 0 && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-200 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 animate-bounce">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2">
                <span>{stuckDuties.length} Duty is currently Blocked / Stuck!</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-200 text-rose-800 font-bold uppercase">
                  Action Required
                </span>
              </h2>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                Staff member reported a bottleneck. Click on the duty to read the blocker details and unblock them immediately.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStatusFilter("stuck")}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition shrink-0"
          >
            Filter Stuck Duties ({stuckDuties.length})
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Total Duties */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 p-3 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Duties</span>
            <div className="p-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600">
              <ListTodo className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stats.total}</div>
          <p className="text-[10px] text-gray-400 mt-0.5">Assigned for {selectedDate}</p>
        </div>

        {/* To Do / Pending */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 p-3 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Pending</span>
            <div className="p-1 rounded-md bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stats.pending}</div>
          <p className="text-[10px] text-gray-400 mt-0.5">Not started yet</p>
        </div>

        {/* In Progress */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 p-3 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">In Progress</span>
            <div className="p-1 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-600">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">{stats.inProgress}</div>
          <p className="text-[10px] text-gray-400 mt-0.5">Active execution</p>
        </div>

        {/* Stuck / Blocked */}
        <div className={`p-3 rounded-xl shadow-xs border transition ${
          stats.stuck > 0
            ? "bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-900"
            : "bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Stuck
            </span>
            <div className="p-1 rounded-md bg-rose-100 dark:bg-rose-900/50 text-rose-600">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-rose-600 dark:text-rose-400 mt-1">{stats.stuck}</div>
          <p className="text-[10px] text-rose-500 dark:text-rose-400 mt-0.5">Requires guidance</p>
        </div>

        {/* Completed */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 p-3 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Completed</span>
            <div className="p-1 rounded-md bg-purple-100 dark:bg-purple-900/40 text-purple-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.completed}</div>
          <p className="text-[10px] text-gray-400 mt-0.5">Awaiting validation</p>
        </div>

        {/* Validated */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 p-3 rounded-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Validated</span>
            <div className="p-1 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.validated}</div>
          <p className="text-[10px] text-gray-400 mt-0.5">Super Admin approved</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-gray-900 p-3.5 rounded-xl border border-gray-200/80 dark:border-gray-800 space-y-3 shadow-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs border-b border-gray-100 dark:border-gray-800">
          {[
            { id: "all", label: "All Duties", count: stats.total },
            { id: "pending", label: "Pending", count: stats.pending },
            { id: "in_progress", label: "In Progress", count: stats.inProgress },
            { id: "stuck", label: "🚨 Stuck", count: stats.stuck },
            { id: "completed", label: "Completed", count: stats.completed },
            { id: "validated", label: "Validated", count: stats.validated },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition shrink-0 flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? "bg-teal-600 text-white shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  statusFilter === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search duties by title or instruction..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          {/* Staff Filter (Admin view) */}
          {isAdmin ? (
            <div>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-hidden"
              >
                <option value="all">All Staff Members</option>
                {staffMembers.map((sm) => (
                  <option key={sm._id} value={sm._id}>
                    {sm.fullName} ({sm.role})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="text-xs bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-teal-200 dark:border-teal-900">
              <User className="w-3.5 h-3.5" />
              <span>Viewing my assigned duties ({user?.fullName || "Staff"})</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Duties List */}
      {isLoadingDuties ? (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <RotateCcw className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-3" />
          <p className="text-xs text-gray-500">Loading daily duties...</p>
        </div>
      ) : duties.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-800 space-y-3">
          <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            No duties found for this selection
          </h2>
          {!isAdmin && (
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Great job! You have no pending duties matching these filters.
            </p>
          )}
          {isAdmin && (
            <button
              onClick={handleOpenAssign}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Assign Duty Now
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {duties.map((duty) => {
            const statusCfg = STATUS_CONFIG[duty.status] || STATUS_CONFIG.pending;
            const deadlineInfo = getDeadlineText(duty.deadline, duty.deadlineTime);

            return (
              <div
                key={duty._id}
                className={`p-4 rounded-xl border transition-all duration-200 bg-white dark:bg-gray-900 shadow-xs hover:shadow-md ${
                  duty.status === "stuck"
                    ? "border-rose-300 dark:border-rose-800/80 bg-rose-50/20"
                    : duty.status === "validated"
                    ? "border-emerald-200 dark:border-emerald-900/50"
                    : "border-gray-200/90 dark:border-gray-800"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left: Info & Details */}
                  <div className="space-y-2.5 flex-1 min-w-0">
                    {/* Header Chips */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Status */}
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${statusCfg.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                        {statusCfg.label}
                      </span>

                      {/* Deadline Tag */}
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 ${
                          deadlineInfo.isOverdue
                            ? "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 font-bold"
                            : deadlineInfo.isDueSoon
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-semibold"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {deadlineInfo.text}
                      </span>

                      {/* Carry Forward Tag */}
                      {duty.isCarriedForward && (
                        <span
                          className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                          title={`Carried forward from ${duty.carriedForwardFrom || duty.originalDutyDate || "previous day"}`}
                        >
                          <RotateCcw className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                          Carried forward {duty.carriedForwardFrom ? `from ${duty.carriedForwardFrom}` : ""}
                        </span>
                      )}

                      {/* If viewing a past date and this duty was carried forward to a later date */}
                      {duty.dutyDate > selectedDate && (
                        <span
                          className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800"
                          title={`Carried forward to ${duty.dutyDate}`}
                        >
                          <RotateCcw className="w-3 h-3 text-blue-600 dark:text-blue-400 -scale-x-100" />
                          Carried forward to {duty.dutyDate}
                        </span>
                      )}
                    </div>

                    {/* Duty Title */}
                    <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                      {duty.title}
                    </h3>

                    {/* Description */}
                    {duty.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                        {duty.description}
                      </p>
                    )}

                    {/* Stuck Details Box if duty is stuck */}
                    {duty.status === "stuck" && duty.stuckInfo?.isStuck && (
                      <div className="p-3 rounded-lg bg-rose-100/70 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-300">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          <span>Reported Blocker:</span>
                        </div>
                        <p className="text-rose-700 dark:text-rose-200 pl-5">
                          {duty.stuckInfo.reason || "Staff reported being blocked on this duty."}
                        </p>
                      </div>
                    )}

                    {/* Validation Feedback Box if validated */}
                    {duty.status === "validated" && duty.validationInfo?.isValidated && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>
                            Validated by{" "}
                            <strong>
                              {(duty.validationInfo.validatedBy as any)?.fullName || "Admin"}
                            </strong>
                            {duty.validationInfo.feedback ? `: "${duty.validationInfo.feedback}"` : ""}
                          </span>
                        </div>
                        {duty.validationInfo.rating && (
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {[...Array(duty.validationInfo.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Staff & Assignee Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-1">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-teal-600" />
                        <span>
                          Assigned to:{" "}
                          <strong className="text-gray-800 dark:text-gray-200">
                            {duty.assignedTo?.fullName || "Staff Member"}
                          </strong>
                        </span>
                      </div>
                      {duty.assignedBy && (
                        <div>
                          <span>
                            Assigned by:{" "}
                            <span className="text-gray-700 dark:text-gray-300">
                              {duty.assignedBy.fullName}
                            </span>
                          </span>
                        </div>
                      )}
                      <div>
                        <span>Date: {duty.dutyDate}</span>
                        {duty.originalDutyDate && duty.originalDutyDate !== duty.dutyDate && (
                          <span className="text-gray-400 text-[11px] ml-1">
                            (Original: {duty.originalDutyDate})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Progress Tracker & Action Buttons */}
                  <div className="lg:w-72 shrink-0 flex flex-col justify-between space-y-3 bg-gray-50/70 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-200/60 dark:border-gray-800">
                    {/* Live Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="font-bold text-teal-600 dark:text-teal-400">{duty.progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            duty.status === "validated"
                              ? "bg-emerald-500"
                              : duty.status === "stuck"
                              ? "bg-rose-500"
                              : "bg-teal-500"
                          }`}
                          style={{ width: `${duty.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Target Metric Count if set */}
                    {duty.targetCount && duty.targetCount > 0 ? (
                      <div className="flex items-center justify-between text-xs bg-white dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-800">
                        <span className="text-gray-500">Target Metrics:</span>
                        <span className="font-bold text-gray-800 dark:text-gray-200">
                          {duty.completedCount} / {duty.targetCount} completed
                        </span>
                      </div>
                    ) : null}

                    {/* Submission Notes & Proof Link */}
                    {duty.completionInfo?.proofLink && (
                      <a
                        href={duty.completionInfo.proofLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-teal-600 hover:underline flex items-center gap-1 font-medium"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View Deliverable / Work Proof
                      </a>
                    )}

                    {/* Action Buttons Row */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {/* Update Progress Button */}
                      <button
                        onClick={() => handleOpenProgress(duty)}
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 text-xs font-semibold transition text-center"
                      >
                        Update Progress
                      </button>

                      {/* Stuck / Blocker Toggle Button */}
                      {duty.status === "stuck" ? (
                        <button
                          onClick={() => stuckMutation.mutate({ id: duty._id, payload: { isStuck: false } })}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition"
                          title="Unblock this duty"
                        >
                          Resolve Stuck
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenStuck(duty)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-semibold transition"
                          title="Report Blocker"
                        >
                          Stuck?
                        </button>
                      )}

                      {/* Admin Validate Button */}
                      {isAdmin && (
                        <button
                          onClick={() => handleOpenValidate(duty)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold transition"
                          title="Validate & Approve"
                        >
                          Validate
                        </button>
                      )}

                      {/* Comments Drawer Button */}
                      <button
                        onClick={() => handleOpenComments(duty)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 relative transition"
                        title="Duty comments and discussion"
                      >
                        <MessageSquare className="w-4 h-4" />
                        {duty.comments && duty.comments.length > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-600 text-[9px] font-bold text-white flex items-center justify-center">
                            {duty.comments.length}
                          </span>
                        )}
                      </button>

                      {/* Admin Edit/Delete */}
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleOpenEdit(duty)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition"
                            title="Edit duty"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete duty "${duty.title}"?`)) {
                                deleteMutation.mutate(duty._id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-rose-100 text-gray-600 hover:text-rose-600 dark:bg-gray-800 transition"
                            title="Delete duty"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. ASSIGN DAILY DUTY MODAL (ADMIN)                       */}
      {/* ======================================================== */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  Assign Daily Duty
                </h3>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!assignForm.title.trim()) {
                  toast.error("Duty title is required");
                  return;
                }
                if (assignForm.assignedToStaffIds.length === 0) {
                  toast.error("Please select at least one staff member");
                  return;
                }
                createDutyMutation.mutate(assignForm);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Duty Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Call 50 prospective applicants from UAE list"
                  value={assignForm.title}
                  onChange={(e) => setAssignForm({ ...assignForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-hidden"
                  required
                />
              </div>

              {/* Multi-Staff Selection */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Assign to Staff Member(s) *
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
                  {staffMembers.map((sm) => {
                    const isSelected = assignForm.assignedToStaffIds.includes(sm._id);
                    return (
                      <label
                        key={sm._id}
                        className={`flex items-center gap-2 p-1.5 rounded-md cursor-pointer transition ${
                          isSelected
                            ? "bg-teal-100/70 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 font-semibold"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAssignForm({
                                ...assignForm,
                                assignedToStaffIds: [...assignForm.assignedToStaffIds, sm._id],
                              });
                            } else {
                              setAssignForm({
                                ...assignForm,
                                assignedToStaffIds: assignForm.assignedToStaffIds.filter((id) => id !== sm._id),
                              });
                            }
                          }}
                          className="rounded text-teal-600 focus:ring-teal-500"
                        />
                        <span className="truncate">{sm.fullName}</span>
                      </label>
                    );
                  })}
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  You can assign this task to multiple staff members simultaneously.
                </p>
              </div>

              {/* Date & Deadline */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    Duty Date
                  </label>
                  <input
                    type="date"
                    value={assignForm.dutyDate}
                    onChange={(e) => setAssignForm({ ...assignForm, dutyDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    Deadline Time
                  </label>
                  <input
                    type="time"
                    value={assignForm.deadlineTime}
                    onChange={(e) => setAssignForm({ ...assignForm, deadlineTime: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Instructions & Guidelines
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide instructions, expectations, and any links or guidelines needed for the staff member..."
                  value={assignForm.description}
                  onChange={(e) => setAssignForm({ ...assignForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createDutyMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold transition"
                >
                  {createDutyMutation.isPending ? "Assigning..." : "Assign Duty"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. UPDATE PROGRESS MODAL                                 */}
      {/* ======================================================== */}
      {isProgressModalOpen && activeDuty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Update Duty Progress
              </h3>
              <button
                onClick={() => setIsProgressModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs bg-gray-50 dark:bg-gray-800 p-2.5 rounded-lg">
              <div className="font-semibold text-gray-800 dark:text-gray-200">{activeDuty.title}</div>
              <div className="text-gray-400 mt-0.5">Assigned to: {activeDuty.assignedTo?.fullName}</div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProgressMutation.mutate({
                  id: activeDuty._id,
                  payload: progressForm,
                });
              }}
              className="space-y-3.5 text-xs"
            >
              {/* Progress Slider */}
              <div>
                <div className="flex items-center justify-between font-semibold mb-1">
                  <span>Progress Percentage:</span>
                  <span className="text-teal-600 font-bold text-sm">{progressForm.progress}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progressForm.progress}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setProgressForm({
                      ...progressForm,
                      progress: val,
                      status: val === 100 ? "completed" : val > 0 ? "in_progress" : "pending",
                    });
                  }}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              {/* Completed Units if target was set */}
              {activeDuty.targetCount && activeDuty.targetCount > 0 ? (
                <div>
                  <label className="block font-semibold mb-1">
                    Completed Units (Target: {activeDuty.targetCount})
                  </label>
                  <input
                    type="number"
                    value={progressForm.completedCount}
                    onChange={(e) =>
                      setProgressForm({ ...progressForm, completedCount: Number(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg"
                  />
                </div>
              ) : null}

              {/* Status Selector */}
              <div>
                <label className="block font-semibold mb-1">Status</label>
                <select
                  value={progressForm.status}
                  onChange={(e) =>
                    setProgressForm({
                      ...progressForm,
                      status: e.target.value as DutyStatus,
                      progress: e.target.value === "completed" ? 100 : progressForm.progress,
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg"
                >
                  <option value="pending">To Do / Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed (Ready for Validation)</option>
                </select>
              </div>

              {/* Work Notes / Submission Proof */}
              <div>
                <label className="block font-semibold mb-1">Completion Notes / Summary of Work</label>
                <textarea
                  rows={2}
                  placeholder="Summarize what was completed, key highlights, or outcome..."
                  value={progressForm.notes}
                  onChange={(e) => setProgressForm({ ...progressForm, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg"
                />
              </div>

              {/* Proof Link */}
              <div>
                <label className="block font-semibold mb-1">Deliverable / Sheet / Proof Link (Optional)</label>
                <input
                  type="url"
                  placeholder="https://docs.google.com/..."
                  value={progressForm.proofLink}
                  onChange={(e) => setProgressForm({ ...progressForm, proofLink: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsProgressModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProgressMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                >
                  {updateProgressMutation.isPending ? "Saving..." : "Save Progress"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. REPORT BLOCKER / STUCK MODAL                          */}
      {/* ======================================================== */}
      {isStuckModalOpen && activeDuty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-300 dark:border-rose-900 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  Report Stuck / Blocker
                </h3>
              </div>
              <button
                onClick={() => setIsStuckModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Facing an obstacle or bottleneck? Report it now so Super Admin is immediately alerted to guide or unblock you.
            </p>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-gray-600">Quick Select Reason:</span>
              <div className="flex flex-wrap gap-1.5">
                {STUCK_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setStuckReason(p)}
                    className="text-[10px] px-2 py-1 rounded-md bg-gray-100 hover:bg-rose-100 text-gray-700 hover:text-rose-700 transition"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!stuckReason.trim()) {
                  toast.error("Please explain the reason you are stuck");
                  return;
                }
                stuckMutation.mutate({
                  id: activeDuty._id,
                  payload: { isStuck: true, reason: stuckReason },
                });
              }}
              className="space-y-3.5 text-xs pt-1"
            >
              <div>
                <label className="block font-semibold mb-1 text-gray-700">Detailed Blocker Description *</label>
                <textarea
                  rows={3}
                  placeholder="Explain what is blocking you and what you need from Admin or other team members..."
                  value={stuckReason}
                  onChange={(e) => setStuckReason(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 rounded-lg focus:ring-1 focus:ring-rose-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsStuckModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={stuckMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold transition"
                >
                  {stuckMutation.isPending ? "Flagging..." : "Flag Duty as Stuck"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. ADMIN VALIDATE / APPROVE DUTY MODAL                  */}
      {/* ======================================================== */}
      {isValidateModalOpen && activeDuty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  Validate Daily Duty
                </h3>
              </div>
              <button
                onClick={() => setIsValidateModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded-lg space-y-1.5">
              <div className="font-bold text-gray-800 dark:text-gray-100">{activeDuty.title}</div>
              <div className="text-gray-500">
                Staff: <strong>{activeDuty.assignedTo?.fullName}</strong> | Progress: {activeDuty.progress}%
              </div>
              {activeDuty.completionInfo?.notes && (
                <div className="pt-1 text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Staff Notes:</span> {activeDuty.completionInfo.notes}
                </div>
              )}
              {activeDuty.completionInfo?.proofLink && (
                <div className="pt-0.5">
                  <a
                    href={activeDuty.completionInfo.proofLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Deliverable / Proof Link
                  </a>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                validateMutation.mutate({
                  id: activeDuty._id,
                  payload: validationForm,
                });
              }}
              className="space-y-3.5 text-xs"
            >
              {/* Decision Radio */}
              <div>
                <label className="block font-semibold mb-1.5">Validation Decision</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setValidationForm({ ...validationForm, isValidated: true })}
                    className={`p-2.5 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition ${
                      validationForm.isValidated
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs"
                        : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve & Validate
                  </button>
                  <button
                    type="button"
                    onClick={() => setValidationForm({ ...validationForm, isValidated: false })}
                    className={`p-2.5 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition ${
                      !validationForm.isValidated
                        ? "bg-rose-50 border-rose-500 text-rose-700 shadow-xs"
                        : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Request Revisions
                  </button>
                </div>
              </div>

              {/* Rating (if approved) */}
              {validationForm.isValidated && (
                <div>
                  <label className="block font-semibold mb-1">Performance Rating (1 to 5 Stars)</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setValidationForm({ ...validationForm, rating: star })}
                        className="p-1 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= validationForm.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-gray-500 font-medium ml-1">
                      {validationForm.rating} / 5 Stars
                    </span>
                  </div>
                </div>
              )}

              {/* Feedback Note */}
              <div>
                <label className="block font-semibold mb-1">
                  {validationForm.isValidated ? "Appreciation / Feedback Note" : "Revision Instructions *"}
                </label>
                <textarea
                  rows={2}
                  placeholder={
                    validationForm.isValidated
                      ? "Great job, calls and records verified!"
                      : "Please complete the remaining 10 calls or update notes..."
                  }
                  value={validationForm.feedback}
                  onChange={(e) => setValidationForm({ ...validationForm, feedback: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsValidateModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={validateMutation.isPending}
                  className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                    validationForm.isValidated ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  {validateMutation.isPending
                    ? "Saving..."
                    : validationForm.isValidated
                    ? "Confirm Approval"
                    : "Send Revisions"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. COMMENTS & DISCUSSION DRAWER                          */}
      {/* ======================================================== */}
      {isCommentsDrawerOpen && activeDuty && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-gray-200 dark:border-gray-800">
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-teal-600" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                    Duty Discussion & Notes
                  </h3>
                  <p className="text-[11px] text-gray-400 truncate max-w-xs">{activeDuty.title}</p>
                </div>
              </div>
              <button
                onClick={() => setIsCommentsDrawerOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comment Thread Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {activeDuty.comments && activeDuty.comments.length > 0 ? (
                activeDuty.comments.map((c, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl text-xs space-y-1 ${
                      c.senderRole === "admin"
                        ? "bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 ml-4"
                        : "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mr-4"
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold">
                      <span className="flex items-center gap-1.5 text-gray-800 dark:text-gray-200">
                        {c.senderName}
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                            c.senderRole === "admin"
                              ? "bg-teal-200 text-teal-800"
                              : "bg-gray-300 text-gray-700"
                          }`}
                        >
                          {c.senderRole}
                        </span>
                      </span>
                      <span className="text-[10px] text-gray-400 font-normal">
                        {new Date(c.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {c.text}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400 text-xs">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  No comments yet. Start the conversation!
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCommentText.trim()) return;
                  commentMutation.mutate({
                    id: activeDuty._id,
                    text: newCommentText,
                  });
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Type an update, question, or guidance..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={commentMutation.isPending || !newCommentText.trim()}
                  className="p-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}



      {/* ======================================================== */}
      {/* 7. EDIT DUTY DETAILS MODAL                               */}
      {/* ======================================================== */}
      {isEditModalOpen && activeDuty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100 dark:border-gray-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                Edit Duty Details
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateDutyMutation.mutate({
                  id: editForm.id,
                  payload: editForm,
                });
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Duty Title *</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Assigned Staff</label>
                <select
                  value={editForm.assignedTo}
                  onChange={(e) => setEditForm({ ...editForm, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg"
                >
                  {staffMembers.map((sm) => (
                    <option key={sm._id} value={sm._id}>
                      {sm.fullName} ({sm.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Duty Date</label>
                  <input
                    type="date"
                    value={editForm.dutyDate}
                    onChange={(e) => setEditForm({ ...editForm, dutyDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Deadline Time</label>
                  <input
                    type="time"
                    value={editForm.deadlineTime}
                    onChange={(e) => setEditForm({ ...editForm, deadlineTime: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Target Count</label>
                <input
                  type="number"
                  value={editForm.targetCount}
                  onChange={(e) => setEditForm({ ...editForm, targetCount: Number(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3 py-2 rounded-lg bg-gray-100 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateDutyMutation.isPending}
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                >
                  {updateDutyMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyDutiesPage;
