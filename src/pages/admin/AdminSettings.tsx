import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-toastify";
import { adminApplicationRoutes } from "@/utils/constants";
import {
  Trash2,
  Edit2,
  Plus,
  X,
  Eye,
  EyeOff,
  Users,
  Clock,
  LogIn,
  LogOut,
  RefreshCw,
  Filter,
  Calendar,
  Monitor,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SystemUser {
  _id: string;
  username: string;
  fullName: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  lastLoginAt?: string | null;
  lastLogoutAt?: string | null;
  isOnline?: boolean;
}

interface StaffSummaryItem {
  _id: string;
  username: string;
  fullName: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  lastLogoutAt: string | null;
  isOnline: boolean;
  todayLoginCount: number;
  totalLoginCount: number;
}

interface StaffAuthLogItem {
  _id: string;
  userId?: string | null;
  username: string;
  fullName: string;
  role: "admin" | "staff";
  action: "LOGIN" | "LOGOUT";
  ipAddress?: string;
  userAgent?: string;
  sessionDurationMs?: number | null;
  createdAt: string;
}

interface StaffAuthLogsResponse {
  logs: StaffAuthLogItem[];
  total: number;
  page: number;
  totalPages: number;
  staffSummary: StaffSummaryItem[];
}

const formatDateTime = (iso?: string | null): string => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

const formatShortDateTime = (iso?: string | null): string => {
  if (!iso) return "Never";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "Never";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatRelativeTime = (iso?: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ${diffMin % 60}m ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
};

const formatSessionDuration = (ms?: number | null): string => {
  if (ms === null || ms === undefined || ms <= 0) return "—";
  const totalSec = Math.floor(ms / 1000);
  if (totalSec < 60) return `${totalSec}s`;
  const totalMin = Math.floor(totalSec / 60);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
};

const parseUserAgent = (ua?: string): string => {
  if (!ua) return "Web Browser";
  let browser = "Browser";
  if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Chrome/") && !ua.includes("Edg/")) browser = "Chrome";
  else if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Safari/") && !ua.includes("Chrome/")) browser = "Safari";

  let os = "";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Mac OS X")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";

  return os ? `${browser} • ${os}` : browser;
};

const AdminSettings: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"users" | "auth-logs">("users");

  // Modal & User Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"admin" | "staff">("staff");
  const [permissions, setPermissions] = useState<string[]>([]);

  // Auth Logs Filter State
  const [staffFilter, setStaffFilter] = useState<string>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [logPage, setLogPage] = useState<number>(1);
  const logLimit = 15;

  // Fetch Users
  const { data: users = [], isLoading } = useQuery<SystemUser[]>({
    queryKey: ["systemUsers"],
    queryFn: async () => {
      const response = await axiosInstance.get("/admin/system-users");
      return response.data.data;
    },
  });

  // Fetch Staff Login & Logout Logs
  const {
    data: authLogsData,
    isLoading: isLogsLoading,
    isFetching: isLogsFetching,
    refetch: refetchAuthLogs,
  } = useQuery<StaffAuthLogsResponse>({
    queryKey: ["staffAuthLogs", staffFilter, actionFilter, dateFilter, logPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(logPage));
      params.set("limit", String(logLimit));
      if (staffFilter && staffFilter !== "all") params.set("userId", staffFilter);
      if (actionFilter && actionFilter !== "all") params.set("action", actionFilter);
      if (dateFilter) params.set("date", dateFilter);

      const response = await axiosInstance.get(`/admin/system-users/auth-logs?${params.toString()}`);
      return response.data.data;
    },
    refetchInterval: activeTab === "auth-logs" ? 30000 : false,
  });

  const staffSummary = authLogsData?.staffSummary || [];
  const authLogs = authLogsData?.logs || [];
  const totalLogsCount = authLogsData?.total || 0;
  const totalLogPages = authLogsData?.totalPages || 1;
  const onlineCount = staffSummary.filter((s) => s.isOnline).length;

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await axiosInstance.post("/admin/system-users", payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["systemUsers"] });
      queryClient.invalidateQueries({ queryKey: ["staffAuthLogs"] });
      toast.success("User created successfully");
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create user");
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; data: any }) => {
      const response = await axiosInstance.patch(`/admin/system-users/${payload.id}`, payload.data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["systemUsers"] });
      queryClient.invalidateQueries({ queryKey: ["staffAuthLogs"] });
      toast.success("User updated successfully");
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update user");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axiosInstance.delete(`/admin/system-users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["systemUsers"] });
      queryClient.invalidateQueries({ queryKey: ["staffAuthLogs"] });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });

  const openCreateModal = () => {
    setEditingUser(null);
    setUsername("");
    setPassword("");
    setFullName("");
    setRole("staff");
    setPermissions([]);
    setIsModalOpen(true);
  };

  const openEditModal = (user: SystemUser) => {
    setEditingUser(user);
    setUsername(user.username);
    setPassword("");
    setFullName(user.fullName);
    setRole(user.role as "admin" | "staff");
    setPermissions(user.permissions || []);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const togglePermission = (path: string) => {
    setPermissions((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      const data: any = { fullName, role, permissions };
      if (password) data.password = password;
      updateMutation.mutate({ id: editingUser._id, data });
    } else {
      createMutation.mutate({ username, password, fullName, role, permissions });
    }
  };

  const todayDateStr = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().split("T")[0];
  const hasActiveLogFilter = staffFilter !== "all" || actionFilter !== "all" || Boolean(dateFilter);

  return (
    <div className="p-6 space-y-6">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            System Users Settings
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage staff accounts, sidebar permissions, and track login/logout sessions
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === "users" && (
            <button
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="h-4 w-4" /> Add User
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "users"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & Permissions</span>
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            {users.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("auth-logs")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === "auth-logs"
              ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Staff Login & Logout</span>
          {onlineCount > 0 && (
            <span className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {onlineCount} Online
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: System Users Table */}
      {activeTab === "users" && (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Username
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Permissions
                </th>
                <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No custom users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                      {u.fullName}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{u.username}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                      {u.permissions.join(", ") || "None"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditModal(u)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 mr-4 cursor-pointer"
                        title="Edit User"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this user?")) {
                            deleteMutation.mutate(u._id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 cursor-pointer"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: Staff Login & Logout Tracking */}
      {activeTab === "auth-logs" && (
        <div className="space-y-6">
          {/* Per-Staff Status Overview Cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Staff Session Overview (Click a card to filter logs)
              </h3>
              <button
                type="button"
                onClick={() => refetchAuthLogs()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLogsFetching ? "animate-spin text-blue-600" : ""}`} />
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {staffSummary.map((staff) => {
                const isSelected = staffFilter === staff._id;
                return (
                  <div
                    key={staff._id}
                    onClick={() => {
                      setStaffFilter((prev) => (prev === staff._id ? "all" : staff._id));
                      setLogPage(1);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/40 dark:bg-blue-950/20"
                        : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm">
                            {staff.fullName}
                          </h4>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                              staff.role === "admin"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                            }`}
                          >
                            {staff.role}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          @{staff.username}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 border ${
                          staff.isOnline
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
                            : "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            staff.isOnline ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                          }`}
                        />
                        {staff.isOnline ? "Online" : "Offline"}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs border-t border-gray-100 dark:border-gray-800 pt-2.5">
                      <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                          <LogIn className="w-3 h-3" /> Last Login:
                        </span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {formatShortDateTime(staff.lastLoginAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                          <LogOut className="w-3 h-3" /> Last Logout:
                        </span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                          {formatShortDateTime(staff.lastLogoutAt)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-gray-500">
                        <span>Today&apos;s Logins: <strong className="text-gray-800 dark:text-gray-200">{staff.todayLoginCount}</strong></span>
                        <span>Total: <strong className="text-gray-800 dark:text-gray-200">{staff.totalLoginCount}</strong></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white dark:bg-gray-900 p-3.5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Filter by Staff */}
              <div className="relative flex items-center">
                <Users className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <select
                  value={staffFilter}
                  onChange={(e) => {
                    setStaffFilter(e.target.value);
                    setLogPage(1);
                  }}
                  className="pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer font-medium"
                >
                  <option value="all">All Staff Users</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.fullName} (@{u.username})
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter by Action */}
              <div className="relative flex items-center">
                <Filter className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                <select
                  value={actionFilter}
                  onChange={(e) => {
                    setActionFilter(e.target.value);
                    setLogPage(1);
                  }}
                  className="pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer font-medium"
                >
                  <option value="all">All Events (Login & Logout)</option>
                  <option value="LOGIN">Login Only</option>
                  <option value="LOGOUT">Logout Only</option>
                </select>
              </div>

              {/* Filter by Date */}
              <div className="relative flex items-center gap-1.5">
                <div className="relative flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => {
                      setDateFilter(e.target.value);
                      setLogPage(1);
                    }}
                    className="pl-9 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer font-medium"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDateFilter((prev) => (prev === todayDateStr ? "" : todayDateStr));
                    setLogPage(1);
                  }}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    dateFilter === todayDateStr
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Today
                </button>
              </div>

              {/* Reset Button */}
              {hasActiveLogFilter && (
                <button
                  type="button"
                  onClick={() => {
                    setStaffFilter("all");
                    setActionFilter("all");
                    setDateFilter("");
                    setLogPage(1);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>

            {/* Count Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-50 dark:bg-cyan-950/60 text-[#00838f] dark:text-cyan-300 border border-cyan-200/80 dark:border-cyan-800/80">
                <span className="font-bold">{totalLogsCount}</span>
                <span className="font-normal">{totalLogsCount === 1 ? "record" : "records"}</span>
              </span>
            </div>
          </div>

          {/* Login & Logout History Table */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Staff Member
                    </th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Event
                    </th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Date & Time
                    </th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Session Duration
                    </th>
                    <th className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Browser / Device
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {isLogsLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                        Loading login & logout logs...
                      </td>
                    </tr>
                  ) : authLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                        No login or logout events recorded yet for the selected filters.
                      </td>
                    </tr>
                  ) : (
                    authLogs.map((log) => {
                      const isLogin = log.action === "LOGIN";
                      return (
                        <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40">
                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="font-medium text-gray-900 dark:text-gray-100 text-sm flex items-center gap-1.5">
                                  <span>{log.fullName}</span>
                                  <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                                      log.role === "admin"
                                        ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300"
                                        : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                                    }`}
                                  >
                                    {log.role}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  @{log.username}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-3.5">
                            {isLogin ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
                                <LogIn className="w-3.5 h-3.5" />
                                Logged In
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800">
                                <LogOut className="w-3.5 h-3.5" />
                                Logged Out
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-3.5">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {formatDateTime(log.createdAt)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {formatRelativeTime(log.createdAt)}
                            </div>
                          </td>

                          <td className="px-6 py-3.5 text-sm text-gray-700 dark:text-gray-300">
                            {isLogin ? (
                              <span className="text-xs text-gray-400">—</span>
                            ) : log.sessionDurationMs ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300">
                                <Clock className="w-3 h-3 text-gray-500" />
                                {formatSessionDuration(log.sessionDurationMs)}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </td>

                          <td className="px-6 py-3.5">
                            <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                              <Monitor className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span>{parseUserAgent(log.userAgent)}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            {totalLogPages > 1 && (
              <div className="px-6 py-3.5 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Page <strong className="text-gray-800 dark:text-gray-200">{logPage}</strong> of{" "}
                  <strong className="text-gray-800 dark:text-gray-200">{totalLogPages}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={logPage <= 1}
                    onClick={() => setLogPage((p) => Math.max(1, p - 1))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </button>
                  <button
                    type="button"
                    disabled={logPage >= totalLogPages}
                    onClick={() => setLogPage((p) => Math.min(totalLogPages, p + 1))}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {editingUser ? "Edit User" : "Create New User"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Username (Email/ID)
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingUser}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password{" "}
                    {editingUser && (
                      <span className="text-gray-400 font-normal">(Leave blank to keep current)</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required={!editingUser}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as "admin" | "staff")}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sidebar Menu Permissions
                  </label>
                  <button
                    type="button"
                    onClick={() => setPermissions(adminApplicationRoutes.map((r) => r.path))}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Select All
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {adminApplicationRoutes.map((route) => (
                    <label
                      key={route.path}
                      className="flex items-center space-x-2 p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={permissions.includes(route.path)}
                        onChange={() => togglePermission(route.path)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{route.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {editingUser ? "Save Changes" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
