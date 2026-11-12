import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { toast } from "react-toastify";
import {
  Layers,
  Users,
  Clock,
  PhoneCall,
  Search,
  X,
  RotateCcw,
  AlertTriangle,
  Plus,
  Trash2,
  MessageCircle,
  Building,
  ChevronLeft,
  ChevronRight,
  Award,
  MapPin,
  Sparkles,
  Globe,
  Eye,
} from "lucide-react";

import {
  adminFetchAllFSSContacts,
  adminCreateFSSContact,
  adminTelecallFSSContact,
  adminAssignFSSContact,
  adminDeleteFSSContact,
  adminSummarizeFSSLeadComment,
  type IFullStackContact,
  type IWebsiteAudit,
} from "@/utils/apis/adminFullStackContactApi";
import { adminFetchSystemStaff, type AssignedStaff } from "@/utils/apis/adminPlatformLeadsApi";
import LeadActivityModal from "@/components/admin/LeadActivityModal";
import WebsiteAuditReportPanel from "@/components/admin/WebsiteAuditReportPanel";
import type { ImportedCustomer, ImportedCustomerActivity } from "@/utils/apis/adminPlatformLeadsApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import ImportLeadsModal from "./ImportLeadsModal";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { isMissedFollowUp, getTodayString } from "@/utils/helpers/followUp";

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

// Imported leads store "Category | Address | Website | Rating" in projectDescription.
const parseLeadDetails = (text?: string) => {
  const result = { category: "", address: "", website: "", rating: "", notes: "" };
  if (!text) return result;
  const plain: string[] = [];
  text.split("|").map((s) => s.trim()).filter(Boolean).forEach((part) => {
    const m = part.match(/^(Category|Address|Website|Rating):\s*(.*)$/i);
    if (m) {
      result[m[1].toLowerCase() as "category" | "address" | "website" | "rating"] = m[2].trim();
    } else {
      plain.push(part);
    }
  });
  if (!result.category && !result.address && plain.length >= 2) {
    result.category = plain[0];
    result.address = plain[1];
    result.notes = plain.slice(2).join(" | ");
  } else if (plain.length) {
    result.notes = plain.join(" | ");
  }
  return result;
};

const truncateText = (text?: string, max = 30): string => {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max)}...` : text;
};

const getLatestComment = (contact?: IFullStackContact | null): string => {
  if (!contact) return "";
  if (contact.comment && contact.comment.trim()) {
    return contact.comment.trim();
  }
  if (contact.activityLog && contact.activityLog.length > 0) {
    const commentActivities = contact.activityLog
      .filter((a) => a.type === "comment" && a.to && a.to.trim())
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
    if (commentActivities.length > 0 && commentActivities[0].to) {
      return commentActivities[0].to.trim();
    }
  }
  return "";
};

interface FSSCommentCellProps {
  comment: string;
}

const FSSCommentCell: React.FC<FSSCommentCellProps> = ({ comment }) => {
  const [isOpen, setIsOpen] = useState(false);
  const trimmed = (comment || "").trim();

  if (!trimmed) {
    return <span className="text-gray-400 text-[11px]">—</span>;
  }

  const shortText = truncateText(trimmed, 36);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title={trimmed}
          className="group flex items-center justify-between gap-1.5 max-w-[210px] w-full text-left px-2 py-1 rounded-md bg-gray-50/70 dark:bg-gray-800/40 hover:bg-blue-50/90 dark:hover:bg-blue-950/40 border border-gray-200/80 hover:border-blue-300 dark:border-gray-800 dark:hover:border-blue-700 transition-all cursor-pointer focus:outline-none"
        >
          <span className="text-[11px] text-gray-700 dark:text-gray-300 truncate whitespace-nowrap group-hover:text-blue-700 dark:group-hover:text-blue-300 flex-1">
            {shortText}
          </span>
          <Eye className="w-3.5 h-3.5 text-blue-500 group-hover:text-blue-700 shrink-0 transition-colors ml-1" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={6}
        className="w-80 sm:w-96 p-3 shadow-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 rounded-xl z-50 animate-in fade-in-0 zoom-in-95"
      >
        <div className="relative pt-1 pr-6 pb-1">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute -top-1 -right-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Activity Notes / Comment
          </div>
          <div className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed max-h-[260px] overflow-y-auto whitespace-pre-wrap break-words select-text">
            {trimmed}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const FullStackSolutionsPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isTony =
    user?.role === "admin" &&
    (user?.email === "tony" ||
      user?.fullName === "Super Admin" ||
      (user as any)?.username === "tony" ||
      user?.email?.toLowerCase().includes("tony") ||
      (user as any)?.username?.toLowerCase().includes("tony") ||
      user?.email === "admin@gmail.com");
  const queryClient = useQueryClient();

  // Filters & Search
  const [page, setPage] = useState<number>(1);
  const limit = 8;
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [assignedStaffFilter, setAssignedStaffFilter] = useState<string>("all");
  const [scheduledDateFilter, setScheduledDateFilter] = useState<string>("any");

  // Modals & Drawers
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<IFullStackContact | null>(null);

  // Form State for Add / Edit Contact
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    companyName: "",
    website: "",
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch Staff List (Admin Tony only)
  const { data: staffList = [] } = useQuery<AssignedStaff[]>({
    queryKey: ["adminStaffList"],
    queryFn: adminFetchSystemStaff,
    enabled: isTony,
  });

  // Fetch Contacts
  const {
    data: contactsResponse,
    isLoading,
  } = useQuery({
    queryKey: [
      "fss-contacts",
      page,
      limit,
      debouncedSearch,
      statusFilter,
      assignedStaffFilter,
      scheduledDateFilter,
    ],
    queryFn: () =>
      adminFetchAllFSSContacts({
        page,
        limit,
        search: debouncedSearch,
        status: statusFilter,
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
      queryClient.invalidateQueries({ queryKey: ["adminFSSPendingTodayCount"] });
      toast.success("Contact added successfully");
      setIsAddModalOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to add contact");
    },
  });

  const telecallMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { status?: string; comment?: string; scheduledDate?: string; website?: string };
    }) => adminTelecallFSSContact(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["fss-contacts"] });
      queryClient.invalidateQueries({ queryKey: ["adminFSSPendingTodayCount"] });
      toast.success("Lead updated successfully");
      setSelectedContact(updated);
      setIsDrawerOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update lead");
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, staffId }: { id: string; staffId: string | null }) =>
      adminAssignFSSContact(id, staffId),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["fss-contacts"] });
      queryClient.invalidateQueries({ queryKey: ["adminFSSPendingTodayCount"] });
      setSelectedContact((prev) => (prev && prev._id === updated._id ? updated : prev));
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
      queryClient.invalidateQueries({ queryKey: ["adminFSSPendingTodayCount"] });
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
      website: "",
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

  const handleOpenDrawer = (contact: IFullStackContact) => {
    setSelectedContact(contact);
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

  const handleModalUpdate = (payload: { status: string; comment: string; scheduledDate?: string; website?: string }) => {
    if (!selectedContact) return;
    telecallMutation.mutate({ id: selectedContact._id, data: payload });
  };

  const handleSaveAudit = async (audit: IWebsiteAudit, newWebsite?: string) => {
    if (!selectedContact) return;
    try {
      const updated = await adminTelecallFSSContact(selectedContact._id, {
        websiteAudit: audit,
        ...(newWebsite ? { website: newWebsite } : {}),
      });
      queryClient.invalidateQueries({ queryKey: ["fss-contacts"] });
      setSelectedContact(updated);
      toast.success("Website audit report saved successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save website audit report");
    }
  };

  const renderWebsiteAudit = () => {
    if (!selectedContact) return null;
    return (
      <WebsiteAuditReportPanel
        contact={selectedContact}
        onSaveAudit={handleSaveAudit}
        isSaving={telecallMutation.isPending}
      />
    );
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
    setAssignedStaffFilter("all");
    setScheduledDateFilter("any");
    setPage(1);
  };

  // Map an FSS contact to the shape expected by the shared Update Lead popup
  const staffNameById = (value?: string) => {
    if (!value) return value;
    const staff = staffList.find((s) => s._id === value);
    return staff ? staff.fullName || staff.username : value;
  };

  const modalCustomer: ImportedCustomer | null = selectedContact
    ? {
        _id: selectedContact._id,
        name: selectedContact.name,
        email: selectedContact.email || "",
        phone: selectedContact.phone,
        state: selectedContact.state || "",
        designations: [],
        cvUrl: "",
        website: selectedContact.website || parseLeadDetails(selectedContact.projectDescription).website,
        source: "Full Stack Solutions",
        status: selectedContact.status,
        isNewLead: false,
        comment: getLatestComment(selectedContact),
        scheduledDate: selectedContact.scheduledDate,
        assignedTo: selectedContact.assignedTo || null,
        createdAt: selectedContact.createdAt,
        activityLog: (selectedContact.activityLog || []).map(
          (a): ImportedCustomerActivity => ({
            type: a.type,
            from: a.type === "assignment" ? staffNameById(a.from) : a.from,
            to: a.type === "assignment" ? staffNameById(a.to) : a.to,
            at: a.at,
          })
        ),
      }
    : null;

  const renderContactDetails = () => {
    const c = selectedContact;
    if (!c) return null;
    const lead = parseLeadDetails(c.projectDescription);
    const location = [lead.address, c.city, c.state].filter(Boolean).join(", ");
    const mapsUrl = location
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.name} ${location}`)}`
      : "";
    const field = (label: string, value?: React.ReactNode) => (
      <div>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-sm text-gray-900 dark:text-gray-100 font-medium break-words">
          {value || <span className="text-gray-400 font-normal">N/A</span>}
        </p>
      </div>
    );
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
          {field("Name", c.name)}
          {field("Company", c.companyName)}
          {field("Phone", c.phone)}
          {field("Email", c.email)}
          {field("Service", c.service)}
          {field("Budget", c.budget)}
          {field("Category", lead.category)}
          {field("Rating", lead.rating)}
          {field(
            "Website",
            (c.website || lead.website) ? (
              <a
                href={(c.website || lead.website).startsWith("http") ? (c.website || lead.website) : `https://${c.website || lead.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline break-all"
              >
                {c.website || lead.website}
              </a>
            ) : undefined
          )}
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Company Location
            </p>
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View on Google Maps
              </a>
            )}
          </div>
          <p className="text-sm text-gray-900 dark:text-gray-100 font-medium break-words">
            {location || <span className="text-gray-400 font-normal">N/A</span>}
          </p>
        </div>
        {c.websiteAudit && (
          <div className="p-4 bg-purple-50/60 dark:bg-purple-950/20 rounded-xl border border-purple-100 dark:border-purple-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Website Analysis Report
              </span>
              {c.websiteAudit.auditedAt && (
                <span className="text-[10px] text-gray-400">
                  {new Date(c.websiteAudit.auditedAt).toLocaleDateString()}
                  {c.websiteAudit.auditedBy && ` • by ${c.websiteAudit.auditedBy}`}
                </span>
              )}
            </div>
            {c.websiteAudit.report && (
              <p className="text-xs text-gray-700 dark:text-gray-300 font-mono whitespace-pre-wrap p-2.5 rounded-lg bg-white/70 dark:bg-gray-900 border border-purple-100 dark:border-purple-900/30">
                {c.websiteAudit.report
                  .replace(/^#*\s*Website Audit Report.*$/gim, "")
                  .replace(/^#{1,6}\s*/gm, "")
                  .trim()}
              </p>
            )}
          </div>
        )}

        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Description / Notes
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40">
            {lead.notes || (!lead.category && !lead.address ? c.projectDescription : "") || "No description."}
          </p>
        </div>
      </div>
    );
  };

  return (    <div className="space-y-5 text-black dark:text-white mt-0 w-full pb-14">
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

        <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setIsImportOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-xs font-semibold transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Import Leads
        </button>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Contact
        </button>
        </div>
      </div>
      <ImportLeadsModal open={isImportOpen} onOpenChange={setIsImportOpen} />

      <div className="flex flex-col xl:flex-row items-stretch gap-3">
      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 xl:flex-none xl:w-[460px]">
        <div className="bg-gradient-to-br from-indigo-50/60 to-white dark:from-indigo-950/20 dark:to-gray-900 border border-indigo-100 dark:border-indigo-900/50 p-3 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Contacts</span>
            <div className="p-1.5 rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-indigo-700 dark:text-indigo-300 mt-1">{stats.total}</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50/60 to-white dark:from-yellow-950/20 dark:to-gray-900 border border-yellow-100 dark:border-yellow-900/50 p-3 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Pending</span>
            <div className="p-1.5 rounded-md bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-yellow-700 dark:text-yellow-400 mt-1">{stats.pending}</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50/60 to-white dark:from-blue-950/20 dark:to-gray-900 border border-blue-100 dark:border-blue-900/50 p-3 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Contacted</span>
            <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-600">
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-blue-700 dark:text-blue-300 mt-1">{stats.contacted}</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50/60 to-white dark:from-emerald-950/20 dark:to-gray-900 border border-emerald-100 dark:border-emerald-900/50 p-3 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Converted</span>
            <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600">
              <Award className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{stats.converted}</div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-gray-950 p-2.5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-stretch md:items-center gap-2 flex-1 min-w-0">
        {/* Search */}
        <div className="relative flex-1 min-w-[160px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search name, phone, email, company, website, comments..."
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

          {/* Staff Filter (Tony only) */}
          {isTony && (
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
          {(searchTerm || statusFilter !== "all" || assignedStaffFilter !== "all" || scheduledDateFilter !== "any") && (
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
      </div>

      {/* Contacts Table Card */}
      <div className="bg-white dark:bg-gray-950 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Contact / Client</th>
                <th className="px-4 py-3 text-left">Phone & Email</th>
                <th className="px-4 py-3 text-left">Status</th>
                {isTony && <th className="px-4 py-3 text-left">Assigned Staff</th>}
                <th className="px-4 py-3 text-left">Website</th>
                <th className="px-4 py-3 text-left">Comments</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={isTony ? 7 : 6} className="px-4 py-12 text-center text-gray-400">
                    Loading Full Stack Solutions contacts...
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={isTony ? 7 : 6} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 flex items-center justify-center">
                        <Users className="w-5 h-5" />
                      </div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200">No contacts found</p>
                      {(searchTerm || statusFilter !== "all") && (
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
                          <span title={contact.name}>{truncateText(contact.name)}</span>
                        </div>
                        {contact.companyName && contact.companyName.trim().toLowerCase() !== contact.name.trim().toLowerCase() ? (
                          <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3 text-gray-400" />
                            <span title={contact.companyName}>{truncateText(contact.companyName)}</span>
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
                          <span className="whitespace-nowrap">{contact.phone}</span>
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

                      {/* Assigned Staff (Tony only) */}
                      {isTony && (
                        <td className="px-4 py-3">
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
                        </td>
                      )}

                      {/* Website */}
                      <td className="px-4 py-3 max-w-[170px]">
                        {(() => {
                          const site = contact.website || parseLeadDetails(contact.projectDescription).website;
                          if (!site && !contact.websiteAudit) return <span className="text-gray-400 text-[11px]">—</span>;
                          const href = site ? (site.startsWith("http") ? site : `https://${site}`) : "";
                          const label = site ? site.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "") : "";
                          return (
                            <div className="space-y-0.5">
                              {site && (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title={site}
                                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline break-all block"
                                >
                                  {truncateText(label, 24)}
                                </a>
                              )}
                              {contact.websiteAudit?.report && (
                                <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800 tracking-tight">
                                  Report Added
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </td>

                      {/* Comments */}
                      <td className="px-4 py-3 max-w-[220px]">
                        <FSSCommentCell comment={getLatestComment(contact)} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDrawer(contact)}
                            title={missed ? `Follow-up date is in the past (${contact.scheduledDate?.split("T")[0]})` : "Update Lead"}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/60 border transition-colors cursor-pointer ${
                              missed
                                ? "border-red-300 dark:border-red-800 ring-1 ring-red-400/30"
                                : "border-blue-200 dark:border-blue-800"
                            }`}
                          >
                            Update Lead
                            {missed && <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400 shrink-0" />}
                          </button>
                          <button
                            onClick={() => handleDelete(contact._id, contact.name)}
                            title="Delete Contact"
                            aria-label={`Delete ${contact.name}`}
                            className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 hover:bg-rose-100/70 dark:bg-rose-950/30 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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
          <div className="p-3 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
            <div>
              Showing{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {(page - 1) * limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {Math.min(page * limit, totalCount)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {totalCount}
              </span>{" "}
              contacts
            </div>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-colors cursor-pointer"
                title="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce<(number | string)[]>((acc, p, idx, arr) => {
                    if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) {
                      acc.push("...");
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-1 text-gray-400">
                        ...
                      </span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item as number)}
                        className={`h-7 min-w-[28px] px-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                          page === item
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
              </div>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-gray-200 dark:border-gray-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium transition-colors cursor-pointer"
                title="Next page"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
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
                  Website URL
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://example.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            </div>

            {isTony && (
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

      {/* Update Lead popup (shared with Contact List) */}
      <LeadActivityModal
        customer={modalCustomer}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdate={handleModalUpdate}
        onAssignStaff={isTony ? (id, staffId) => assignMutation.mutate({ id, staffId }) : undefined}
        isSaving={telecallMutation.isPending}
        isAdmin={isTony}
        staffList={staffList}
        currentUserName={user?.fullName || user?.username || ""}
        showWebsite
        statusOptions={FSS_STATUS_OPTIONS}
        detailsLabel="Contact Info"
        renderDetails={renderContactDetails}
        reportLabel="Website Audit"
        renderReport={renderWebsiteAudit}
        onSummarizeComment={(content, cust, currentStatus, schedDate) =>
          adminSummarizeFSSLeadComment(
            content,
            selectedContact?.companyName || selectedContact?.name,
            selectedContact?.website,
            currentStatus || cust?.status || selectedContact?.status,
            schedDate || selectedContact?.scheduledDate
          )
        }
      />    </div>
  );
};

export default FullStackSolutionsPage;
