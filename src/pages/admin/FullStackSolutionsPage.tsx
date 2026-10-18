import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { toast } from "react-toastify";
import {
  Layers,
  Users,
  Clock,
  CheckCircle,
  PhoneCall,
  Search,
  Filter,
  Calendar,
  X,
  RotateCcw,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  MessageCircle,
  Building,
  Mail,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  ExternalLink,
  Award,
} from "lucide-react";

import {
  adminFetchAllFSSContacts,
  adminCreateFSSContact,
  adminUpdateFSSContact,
  adminTelecallFSSContact,
  adminAssignFSSContact,
  adminDeleteFSSContact,
  type IFullStackContact,
} from "@/utils/apis/adminFullStackContactApi";
import { adminFetchSystemStaff, type AssignedStaff } from "@/utils/apis/adminPlatformLeadsApi";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { isMissedFollowUp, FOLLOW_UP_WARNING_MESSAGE, getTodayString } from "@/utils/helpers/followUp";

const FSS_STATUS_OPTIONS = [
  "Pending",
  "Contacted",
  "Need Follow Up",
  "In Discussion",
  "Quotation Sent",
  "Converted",
  "Completed",
  "Lost",
];

const FSS_SERVICES = [
  "Full Stack Web Development",
  "Mobile App Development",
  "Custom ERP / CRM",
  "UI/UX Design",
  "Cloud & DevOps",
  "Consultation",
  "Other",
];

const BUDGET_RANGES = [
  "< ₹50,000",
  "₹50,000 - ₹1,00,000",
  "₹1,00,000 - ₹3,00,000",
  "₹3,00,000 - ₹5,00,000",
  "₹5,00,000+",
  "To be discussed",
];

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900/50";
    case "Contacted":
      return "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-900/50";
    case "Need Follow Up":
      return "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 border-orange-200 dark:border-orange-900/50";
    case "In Discussion":
      return "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-900/50";
    case "Quotation Sent":
      return "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900/50";
    case "Converted":
    case "Completed":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50";
    case "Lost":
      return "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-900/50";
    default:
      return "bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
  }
};

const FullStackSolutionsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === "admin";
  const queryClient = useQueryClient();

  // Filters & Search
  const [page, setPage] = useState<number>(1);
  const limit = 10;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [assignedStaffFilter, setAssignedStaffFilter] = useState<string>("all");
  const [scheduledDateFilter, setScheduledDateFilter] = useState<string>("any");

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<IFullStackContact | null>(null);

  // Form State for Add / Edit Contact
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    companyName: "",
    service: "Full Stack Web Development",
    state: "",
    city: "",
    budget: "< ₹50,000",
    projectDescription: "",
    status: "Pending",
    comment: "",
    scheduledDate: "",
    assignedTo: "",
  });

  // Telecalling drawer state
  const [telecallStatus, setTelecallStatus] = useState<string>("Pending");
  const [telecallComment, setTelecallComment] = useState<string>("");
  const [telecallDate, setTelecallDate] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch Staff List
  const { data: staffList = [] } = useQuery<AssignedStaff[]>({
    queryKey: ["adminStaffList"],
    queryFn: adminFetchSystemStaff,
    enabled: isAdmin,
  });

  // Fetch Contacts
  const {
    data: contactsResponse,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [
      "fss-contacts",
      page,
      limit,
      debouncedSearch,
      statusFilter,
      serviceFilter,
      assignedStaffFilter,
      scheduledDateFilter,
    ],
    queryFn: () =>
      adminFetchAllFSSContacts({
        page,
        limit,
        search: debouncedSearch,
        status: statusFilter,
        service: serviceFilter,
        assignedTo: assignedStaffFilter,
        scheduledDate: scheduledDateFilter,
      }),
  });

  const contacts = contactsResponse?.contacts || [];
  const stats = contactsResponse?.stats || { total: 0, pending: 0, contacted: 0, needFollowUp: 0, converted: 0 };
  const totalPages = contactsResponse?.totalPages || 1;
  const totalCount = contactsResponse?.total || 0;

  // Mutations
  const createMutation = useMutation({
    mutationFn: adminCreateFSSContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fss-contacts"] });
      toast.success("Contact added successfully");
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to add contact");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IFullStackContact> }) =>
      adminUpdateFSSContact(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fss-contacts"] });
      toast.success("Contact updated successfully");
      setIsEditModalOpen(false);
      setSelectedContact(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update contact");
    },
  });

  const telecallMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { status?: string; comment?: string; scheduledDate?: string };
    }) => adminTelecallFSSContact(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["fss-contacts"] });
      toast.success("Telecall record updated");
      setSelectedContact(updated);
      setTelecallComment("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update telecall");
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, staffId }: { id: string; staffId: string | null }) =>
      adminAssignFSSContact(id, staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fss-contacts"] });
      toast.success("Staff assigned successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to assign staff");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteFSSContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fss-contacts"] });
      toast.success("Contact deleted");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete contact");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      companyName: "",
      service: "Full Stack Web Development",
      state: "",
      city: "",
      budget: "< ₹50,000",
      projectDescription: "",
      status: "Pending",
      comment: "",
      scheduledDate: "",
      assignedTo: "",
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (contact: IFullStackContact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name || "",
      phone: contact.phone || "",
      email: contact.email || "",
      companyName: contact.companyName || "",
      service: contact.service || "Full Stack Web Development",
      state: contact.state || "",
      city: contact.city || "",
      budget: contact.budget || "< ₹50,000",
      projectDescription: contact.projectDescription || "",
      status: contact.status || "Pending",
      comment: "",
      scheduledDate: contact.scheduledDate ? contact.scheduledDate.split("T")[0] : "",
      assignedTo: contact.assignedTo ? (typeof contact.assignedTo === "object" ? contact.assignedTo._id : contact.assignedTo) : "",
    });
    setIsEditModalOpen(true);
  };

  const handleOpenDrawer = (contact: IFullStackContact) => {
    setSelectedContact(contact);
    setTelecallStatus(contact.status || "Pending");
    setTelecallComment("");
    setTelecallDate(contact.scheduledDate ? contact.scheduledDate.split("T")[0] : "");
    setIsDrawerOpen(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error("Name and Phone number are required");
      return;
    }
    createMutation.mutate(formData as any);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;
    if (!formData.name.trim() || !formData.phone.trim()) {
      toast.error("Name and Phone number are required");
      return;
    }
    updateMutation.mutate({
      id: selectedContact._id,
      data: formData as any,
    });
  };

  const handleTelecallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContact) return;
    telecallMutation.mutate({
      id: selectedContact._id,
      data: {
        status: telecallStatus,
        comment: telecallComment,
        scheduledDate: telecallDate,
      },
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete contact "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const resetAllFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setStatusFilter("all");
    setServiceFilter("all");
    setAssignedStaffFilter("all");
    setScheduledDateFilter("any");
    setPage(1);
  };

  return (
    <div className="space-y-5 text-black dark:text-white mt-0 w-full pb-14">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Full Stack Solutions
          </h1>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Contact
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-indigo-50/60 to-white dark:from-indigo-950/20 dark:to-gray-900 border border-indigo-100 dark:border-indigo-900/50 p-3 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total Contacts</span>
            <div className="p-1.5 rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mt-1">{stats.total}</div>
          <p className="text-[10px] text-gray-500 mt-0.5">Manually added leads</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50/60 to-white dark:from-yellow-950/20 dark:to-gray-900 border border-yellow-100 dark:border-yellow-900/50 p-3 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Pending</span>
            <div className="p-1.5 rounded-md bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-yellow-700 dark:text-yellow-400 mt-1">{stats.pending}</div>
          <p className="text-[10px] text-gray-500 mt-0.5">Awaiting initial call</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50/60 to-white dark:from-blue-950/20 dark:to-gray-900 border border-blue-100 dark:border-blue-900/50 p-3 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Contacted</span>
            <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-600">
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-blue-700 dark:text-blue-300 mt-1">{stats.contacted}</div>
          <p className="text-[10px] text-gray-500 mt-0.5">Calls & chats completed</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50/60 to-white dark:from-emerald-950/20 dark:to-gray-900 border border-emerald-100 dark:border-emerald-900/50 p-3 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Converted</span>
            <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{stats.converted}</div>
          <p className="text-[10px] text-gray-500 mt-0.5">Successfully closed deals</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-gray-950 p-3.5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search name, phone, email, company, service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="py-1.5 px-2.5 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            {FSS_STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Service Filter */}
          <select
            value={serviceFilter}
            onChange={(e) => {
              setServiceFilter(e.target.value);
              setPage(1);
            }}
            className="py-1.5 px-2.5 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Services</option>
            {FSS_SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Follow-up Date Filter */}
          <select
            value={scheduledDateFilter}
            onChange={(e) => {
              setScheduledDateFilter(e.target.value);
              setPage(1);
            }}
            className="py-1.5 px-2.5 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="any">All Dates</option>
            <option value={getTodayString()}>Today's Follow-ups</option>
          </select>

          {/* Staff Filter (Admin only) */}
          {isAdmin && (
            <select
              value={assignedStaffFilter}
              onChange={(e) => {
                setAssignedStaffFilter(e.target.value);
                setPage(1);
              }}
              className="py-1.5 px-2.5 text-xs rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Assigned Staff</option>
              <option value="unassigned">Unassigned</option>
              {staffList.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.fullName || s.username}
                </option>
              ))}
            </select>
          )}

          {/* Reset Filters */}
          {(searchTerm || statusFilter !== "all" || serviceFilter !== "all" || assignedStaffFilter !== "all" || scheduledDateFilter !== "any") && (
            <button
              onClick={resetAllFilters}
              title="Reset all filters"
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Contacts Table Card */}
      <div className="bg-white dark:bg-gray-950 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Contact / Client</th>
                <th className="px-4 py-3 text-left">Phone & Email</th>
                <th className="px-4 py-3 text-left">Service & Budget</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Assigned Staff</th>
                <th className="px-4 py-3 text-left">Follow-up</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    Loading Full Stack Solutions contacts...
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">No contacts found</p>
                      {(searchTerm || statusFilter !== "all" || serviceFilter !== "all") && (
                        <p className="text-gray-400 text-xs max-w-sm">
                          No contacts match your current filters. Try resetting them.
                        </p>
                      )}
                      <button
                        onClick={handleOpenAddModal}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add New Contact
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => {
                  const missed = isMissedFollowUp(contact.status, contact.scheduledDate);
                  const cleanPhone = contact.phone.replace(/[^0-9]/g, "");

                  return (
                    <tr
                      key={contact._id}
                      className="hover:bg-gray-50/60 dark:hover:bg-gray-900/40 transition-colors"
                    >
                      {/* Name & Company */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {contact.name}
                        </div>
                        {contact.companyName ? (
                          <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3 text-gray-400" />
                            <span>{contact.companyName}</span>
                          </div>
                        ) : null}
                        {contact.state || contact.city ? (
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            {[contact.city, contact.state].filter(Boolean).join(", ")}
                          </div>
                        ) : null}
                      </td>

                      {/* Phone & Email */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 font-mono text-gray-800 dark:text-gray-200">
                          <span>{contact.phone}</span>
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Chat on WhatsApp"
                              className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        {contact.email ? (
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-[11px] text-blue-600 hover:underline dark:text-blue-400 block mt-0.5 truncate max-w-[180px]"
                          >
                            {contact.email}
                          </a>
                        ) : (
                          <span className="text-[11px] text-gray-400">No email</span>
                        )}
                      </td>

                      {/* Service & Budget */}
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900/50 text-[11px] font-medium">
                          {contact.service || "Web Development"}
                        </span>
                        {contact.budget && (
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                            Budget: <span className="font-medium text-gray-700 dark:text-gray-300">{contact.budget}</span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full border text-[11px] font-medium ${getStatusBadgeClass(
                            contact.status
                          )}`}
                        >
                          {contact.status}
                        </span>
                      </td>

                      {/* Assigned Staff */}
                      <td className="px-4 py-3">
                        {isAdmin ? (
                          <select
                            value={
                              contact.assignedTo
                                ? typeof contact.assignedTo === "object"
                                  ? contact.assignedTo._id
                                  : contact.assignedTo
                                : ""
                            }
                            onChange={(e) =>
                              assignMutation.mutate({
                                id: contact._id,
                                staffId: e.target.value || null,
                              })
                            }
                            className="text-[11px] py-1 px-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            <option value="">Unassigned</option>
                            {staffList.map((s) => (
                              <option key={s._id} value={s._id}>
                                {s.fullName || s.username}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-gray-600 dark:text-gray-400 text-xs font-medium">
                            {contact.assignedTo && typeof contact.assignedTo === "object"
                              ? contact.assignedTo.fullName || contact.assignedTo.username
                              : "Unassigned"}
                          </span>
                        )}
                      </td>

                      {/* Follow-up */}
                      <td className="px-4 py-3">
                        {contact.scheduledDate ? (
                          <div className="space-y-0.5">
                            <span className="text-gray-700 dark:text-gray-300 font-mono text-[11px]">
                              {contact.scheduledDate.split("T")[0]}
                            </span>
                            {missed && (
                              <div className="flex items-center gap-1 text-[10px] text-red-600 font-medium">
                                <AlertTriangle className="w-3 h-3" />
                                <span>Missed</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-[11px]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDrawer(contact)}
                            title="Telecall / Activity"
                            className="p-1.5 rounded-lg border border-indigo-200 dark:border-indigo-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 transition-colors"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(contact)}
                            title="Edit Contact"
                            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(contact._id, contact.name)}
                              title="Delete Contact"
                              className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
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
        {totalPages > 1 && (
          <div className="p-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
            <div>
              Showing page <span className="font-semibold">{page}</span> of{" "}
              <span className="font-semibold">{totalPages}</span> ({totalCount} contacts)
            </div>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded-md border border-gray-200 dark:border-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded-md border border-gray-200 dark:border-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* ADD CONTACT MODAL                                         */}
      {/* ======================================================== */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600" />
              Add Full Stack Solutions Contact
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-3.5 pt-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. client@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Technologies"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Service Requirement
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
                >
                  {FSS_SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Budget Estimate
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
                >
                  {BUDGET_RANGES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State / Region
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kerala, Tamil Nadu, Dubai"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Initial Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
                >
                  {FSS_STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Scheduled Follow-up Date
                </label>
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {isAdmin && (
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Assign Staff
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Unassigned</option>
                    {staffList.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.fullName || s.username}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Requirement / Notes
              </label>
              <textarea
                rows={2}
                placeholder="Details of client request, project scope, tech stack, or remarks..."
                value={formData.projectDescription}
                onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <DialogFooter className="pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold disabled:opacity-50"
              >
                {createMutation.isPending ? "Adding..." : "Save Contact"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ======================================================== */}
      {/* EDIT CONTACT MODAL                                        */}
      {/* ======================================================== */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-indigo-600" />
              Edit Contact Details
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Update information for {selectedContact?.name}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-3.5 pt-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Service Requirement
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
                >
                  {FSS_SERVICES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Budget Estimate
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
                >
                  {BUDGET_RANGES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  State / Region
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
                >
                  {FSS_STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Requirement / Notes
              </label>
              <textarea
                rows={2}
                value={formData.projectDescription}
                onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <DialogFooter className="pt-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold disabled:opacity-50"
              >
                {updateMutation.isPending ? "Saving..." : "Update Contact"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ======================================================== */}
      {/* TELECALLING & TIMELINE DRAWER (SHEET)                     */}
      {/* ======================================================== */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader className="pb-3 border-b border-gray-200 dark:border-gray-800">
            <SheetTitle className="text-base font-bold text-gray-900 dark:text-gray-100 flex items-center justify-between">
              <span>{selectedContact?.name}</span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  selectedContact?.status ? getStatusBadgeClass(selectedContact.status) : ""
                }`}
              >
                {selectedContact?.status}
              </span>
            </SheetTitle>
            <SheetDescription className="text-xs text-gray-500 flex items-center gap-2">
              <span>{selectedContact?.phone}</span>
              {selectedContact?.companyName && <span>• {selectedContact.companyName}</span>}
            </SheetDescription>
          </SheetHeader>

          {/* Telecall Update Form */}
          <form onSubmit={handleTelecallSubmit} className="py-4 space-y-3.5 border-b border-gray-200 dark:border-gray-800 text-xs">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">Update Telecalling Status</h4>

            <div>
              <label className="block text-gray-600 dark:text-gray-400 mb-1">Contact Status</label>
              <select
                value={telecallStatus}
                onChange={(e) => setTelecallStatus(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
              >
                {FSS_STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-600 dark:text-gray-400 mb-1">
                Scheduled Next Follow-Up
              </label>
              <input
                type="date"
                value={telecallDate}
                onChange={(e) => setTelecallDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-600 dark:text-gray-400 mb-1">Call Remarks / Remarks</label>
              <textarea
                rows={2}
                placeholder="Spoke with client, discussed proposal, agreed on timeline..."
                value={telecallComment}
                onChange={(e) => setTelecallComment(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={telecallMutation.isPending}
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold disabled:opacity-50 transition-colors"
            >
              {telecallMutation.isPending ? "Saving..." : "Record Call Update"}
            </button>
          </form>

          {/* Activity Timeline */}
          <div className="py-4 space-y-3">
            <h4 className="font-semibold text-xs text-gray-800 dark:text-gray-200">Activity History</h4>
            {selectedContact?.activityLog && selectedContact.activityLog.length > 0 ? (
              <div className="space-y-2.5">
                {[...selectedContact.activityLog].reverse().map((act, index) => (
                  <div
                    key={index}
                    className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] text-gray-500">
                      <span className="font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        {act.type}
                      </span>
                      <span>{new Date(act.at).toLocaleString()}</span>
                    </div>
                    {act.type === "status" && (
                      <p className="text-gray-700 dark:text-gray-300">
                        Status changed: <span className="font-medium text-gray-900 dark:text-gray-100">{act.from || "None"}</span> → <span className="font-semibold text-indigo-600">{act.to}</span>
                      </p>
                    )}
                    {act.type === "comment" && (
                      <p className="text-gray-700 dark:text-gray-300 italic">"{act.to}"</p>
                    )}
                    {act.type === "schedule" && (
                      <p className="text-gray-700 dark:text-gray-300">
                        Follow-up scheduled for: <span className="font-semibold">{act.to}</span>
                      </p>
                    )}
                    {act.type === "assignment" && (
                      <p className="text-gray-700 dark:text-gray-300">
                        Staff assignment updated
                      </p>
                    )}
                    {act.by && (
                      <span className="text-[10px] text-gray-400 block">by {act.by}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No activity logged yet.</p>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FullStackSolutionsPage;
