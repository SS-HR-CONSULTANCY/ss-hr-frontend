import React, { useState, useCallback, useEffect } from "react";
import CommonTable from "@/components/common/CommonTable";
import { 
  adminFetchAllPlatformLeads, 
  adminUpdatePlatformLead, 
  adminAssignPlatformLead,
  adminFetchSystemStaff,
  type ImportedCustomer,
  type AssignedStaff 
} from "@/utils/apis/adminPlatformLeadsApi";
import { AdminPlatformLeadsTableColumns } from "@/components/table/tableColumns/AdminPlatformLeadsTableColumn";
import LeadActivityModal from "@/components/admin/LeadActivityModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

import { Users, Clock, CheckCircle, PhoneCall, PhoneOutgoing, Search, X, RotateCcw, UserCheck, CalendarCheck } from "lucide-react";

const CONTACT_STATUS_OPTIONS = [
  "Pending",
  "Contacted",
  "Re-contacted",
  "Need Follow Up",
  "Not Interested",
  "Processing Application",
  "Rejected Application",
  "Completed",
];

// Written out in full so Tailwind can detect every class.
const STATUS_BUTTON_STYLES: Record<string, { idle: string; active: string }> = {
  all: {
    idle: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/50",
    active: "bg-indigo-600 border-indigo-600 text-white",
  },
  Pending: {
    idle: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-900/50",
    active: "bg-yellow-500 border-yellow-500 text-white",
  },
  Contacted: {
    idle: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50",
    active: "bg-blue-600 border-blue-600 text-white",
  },
  "Re-contacted": {
    idle: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-900/50",
    active: "bg-cyan-600 border-cyan-600 text-white",
  },
  "Need Follow Up": {
    idle: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-900/50",
    active: "bg-orange-500 border-orange-500 text-white",
  },
  "Not Interested": {
    idle: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
    active: "bg-gray-600 border-gray-600 text-white",
  },
  "Processing Application": {
    idle: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50",
    active: "bg-purple-600 border-purple-600 text-white",
  },
  "Rejected Application": {
    idle: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50",
    active: "bg-rose-600 border-rose-600 text-white",
  },
  Completed: {
    idle: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50",
    active: "bg-emerald-600 border-emerald-600 text-white",
  },
};

const DATE_FILTER_STORAGE_KEY = "telecallerLeads.dateFilter";

const TelecallerLeads: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === "admin";
  const isTony =
    user?.role === "admin" &&
    (user?.email === "tony" ||
      user?.fullName === "Super Admin" ||
      (user as any)?.username === "tony");
  const [assignedStaffFilter, setAssignedStaffFilter] = useState<string>("all");

  const [selectedCustomer, setSelectedCustomer] = useState<ImportedCustomer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, contacted: 0, needFollowUp: 0, myCallsToday: 0 });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  // Persisted so the "Today" filter survives a page refresh until it is cleared.
  const [dateFilter, setDateFilter] = useState<string>(() => {
    try {
      return localStorage.getItem(DATE_FILTER_STORAGE_KEY) === "today" ? "today" : "any";
    } catch {
      return "any";
    }
  });
  useEffect(() => {
    try {
      if (dateFilter === "today") localStorage.setItem(DATE_FILTER_STORAGE_KEY, "today");
      else localStorage.removeItem(DATE_FILTER_STORAGE_KEY);
    } catch {
      // Storage unavailable (private mode); the filter just won't persist.
    }
  }, [dateFilter]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: staffList = [] } = useQuery<AssignedStaff[]>({
    queryKey: ["adminStaffList"],
    queryFn: adminFetchSystemStaff,
    enabled: isAdmin,
  });

  const assignMutation = useMutation({
    mutationFn: (data: { id: string; staffId: string | null }) =>
      adminAssignPlatformLead(data.id, data.staffId),
    onSuccess: (updatedCustomer) => {
      queryClient.invalidateQueries({ queryKey: ["admin-telecaller-leads"] });
      queryClient.invalidateQueries({ queryKey: ["admin-platform-leads"] });
      const staffName = typeof updatedCustomer.assignedTo === "object" && updatedCustomer.assignedTo
        ? updatedCustomer.assignedTo.fullName || updatedCustomer.assignedTo.username
        : "staff";
      toast.success(updatedCustomer.assignedTo ? `Contact assigned to ${staffName}` : "Contact unassigned");
    },
    onError: () => {
      toast.error("Failed to assign staff");
    },
  });

  const handleAssignStaff = (id: string, staffId: string | null) => {
    assignMutation.mutate({ id, staffId });
  };

  const updateMutation = useMutation({
    mutationFn: (data: { id: string, payload: { status: string, comment: string, scheduledDate?: string, state?: string, assignedTo?: string | null } }) => 
      adminUpdatePlatformLead(data.id, data.payload),
    onSuccess: (updatedCustomer) => {
      queryClient.invalidateQueries({ queryKey: ["admin-telecaller-leads"] });
      setSelectedCustomer(updatedCustomer);
      setIsModalOpen(false);
      toast.success("Lead updated successfully");
    },
    onError: () => {
      toast.error("Failed to update lead");
    }
  });

  const handleView = (customer: ImportedCustomer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleInlineStatusUpdate = (id: string, newStatus: string, existingComment: string, scheduledDate?: string, state?: string) => {
    updateMutation.mutate({
      id,
      payload: { status: newStatus, comment: existingComment, scheduledDate, state }
    });
  };

  const handleModalUpdate = (payload: { status: string; comment: string; scheduledDate?: string }) => {
    if (!selectedCustomer) return;
    updateMutation.mutate({
      id: selectedCustomer._id,
      payload
    });
  };

  const columns = AdminPlatformLeadsTableColumns(
    handleView, 
    handleInlineStatusUpdate, 
    { 
      hideEmail: true,
      hideAssignStaff: !isTony,
      hideComment: false,
      hideScheduledDate: true,
      staffList,
      onAssignStaff: handleAssignStaff,
      isAdmin: isTony,
      staffName: user?.fullName || user?.username || "",
    }
  );

  const fetchAllScheduledLeads = (params?: any) => {
    let scheduledDateParam = 'any';
    if (dateFilter === 'today') {
      scheduledDateParam = new Date().toISOString().split('T')[0];
    } else if (dateFilter !== 'any') {
      scheduledDateParam = dateFilter;
    }

    return adminFetchAllPlatformLeads({
      ...params,
      pagination: {
        ...params?.pagination,
        searchQuery: debouncedSearch || undefined,
        scheduledDate: scheduledDateParam,
        status: statusFilter === "all" ? undefined : statusFilter,
        state: stateFilter === "all" ? undefined : stateFilter,
        assignedTo: isTony && assignedStaffFilter !== "all" ? assignedStaffFilter : undefined,
        today: new Date().toISOString().split('T')[0],
        sortBy: params?.pagination?.sortBy || 'scheduledDate',
        sortOrder: params?.pagination?.sortOrder || 'asc'
      }
    });
  };

  return (
    <div>
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-5">
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-xl shadow-sm border border-blue-100 dark:border-blue-900 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Leads</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</h3>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-xl shadow-sm border border-red-100 dark:border-red-900 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Pending to contact</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</h3>
          </div>
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full text-red-600 dark:text-red-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-xl shadow-sm border border-green-100 dark:border-green-900 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Contacted</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.contacted}</h3>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-xl shadow-sm border border-orange-100 dark:border-orange-900 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Need Follow Up</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.needFollowUp}</h3>
          </div>
          <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400">
            <PhoneCall className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-xl shadow-sm border border-purple-100 dark:border-purple-900 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">My Calls Today</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stats.myCallsToday}</h3>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
            <PhoneOutgoing className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters and Search Bar just below stats */}
      <div className="bg-white dark:bg-gray-950 p-3.5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 mb-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search + Today */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Search Bar */}
          <div className="relative shrink-0 w-full md:w-52">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search name, phone, state, designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-0.5"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

            {/* Today quick filter (next to search) */}
            <button
              type="button"
              onClick={() => setDateFilter((prev) => (prev === "today" ? "any" : "today"))}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg border transition-colors cursor-pointer ${
                dateFilter === "today"
                  ? "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-50/50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              title={dateFilter === "today" ? "Showing contacts scheduled for today — click to clear" : "Show contacts scheduled for today"}
            >
              <CalendarCheck className="w-4 h-4" />
              Today
              {dateFilter === "today" && <X className="w-3.5 h-3.5" />}
            </button>

            {/* Status filter buttons */}
            <div className="flex flex-nowrap items-center gap-1.5 flex-1 min-w-0">
              {["all", ...CONTACT_STATUS_OPTIONS].map((st) => {
                const active = statusFilter === st;
                const c = STATUS_BUTTON_STYLES[st];
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    title={st === "all" ? "All" : st}
                    className={`flex-1 basis-0 min-w-0 px-1.5 inline-flex items-center justify-center py-2 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap overflow-hidden ${
                      active ? `${c.active} shadow-sm` : `${c.idle} hover:brightness-95`
                    }`}
                  >
                    <span className="truncate">{st === "all" ? "All" : st}</span>
                  </button>
                );
              })}
            </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Assigned Staff Filter (Super Admin Tony only) */}
          {isTony && (
            <div className="relative flex items-center">
              <UserCheck className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
              <select
                value={assignedStaffFilter}
                onChange={(e) => setAssignedStaffFilter(e.target.value)}
                className="pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer font-medium text-gray-700 dark:text-gray-300"
              >
                <option value="all">All Staff Contacts</option>
                <option value="unassigned">Unassigned Only</option>
                {staffList.map((s) => (
                  <option key={s._id} value={s._id}>{s.fullName || s.username}</option>
                ))}
              </select>
            </div>
          )}

          {/* Reset Filters */}
          {(statusFilter !== "all" || stateFilter !== "all" || dateFilter !== "any" || assignedStaffFilter !== "all" || searchTerm.trim()) && (
            <button
              onClick={() => {
                setStatusFilter("all");
                setStateFilter("all");
                setDateFilter("any");
                setAssignedStaffFilter("all");
                setSearchTerm("");
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      <CommonTable<ImportedCustomer>
        key={`${statusFilter}-${stateFilter}-${dateFilter}-${assignedStaffFilter}-${debouncedSearch}`}
        id={`${statusFilter}-${stateFilter}-${dateFilter}-${assignedStaffFilter}-${debouncedSearch}`}
        fetchApiFunction={fetchAllScheduledLeads}
        queryKey="admin-telecaller-leads"
        column={columns}
        columnsCount={columns.length}
        pageSize={8}
        onDataFetched={useCallback((data: any) => {
          if (data.stats) {
            setStats(prev => {
              const newTotal = data.stats.total || 0;
              const newPending = data.stats.pending || 0;
              const newContacted = data.stats.contacted || 0;
              const newNeedFollowUp = data.stats.needFollowUp || 0;
              const newMyCallsToday = data.stats.myCallsToday || 0;
              if (
                prev.total === newTotal &&
                prev.pending === newPending &&
                prev.contacted === newContacted &&
                prev.needFollowUp === newNeedFollowUp &&
                prev.myCallsToday === newMyCallsToday
              ) {
                return prev;
              }
              return {
                total: newTotal,
                pending: newPending,
                contacted: newContacted,
                needFollowUp: newNeedFollowUp,
                myCallsToday: newMyCallsToday,
              };
            });
          }
        }, [])}
      />

      <LeadActivityModal
        customer={selectedCustomer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleModalUpdate}
        onAssignStaff={isAdmin ? handleAssignStaff : undefined}
        isSaving={updateMutation.isPending}
        isAdmin={isAdmin}
        staffList={staffList}
        currentUserName={user?.fullName || user?.username || ""}
      />
    </div>
  );
};

export default TelecallerLeads;
