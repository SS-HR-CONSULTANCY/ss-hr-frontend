import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  MapPin,
  Briefcase,
  CalendarCheck,
  MessageSquarePlus,
  History,
  FileText,
  AlertTriangle,
  Sparkles,
  Loader2,
  Undo2,
  Save,
  UserCheck,
  UserPlus,
  RefreshCw,
  MessageSquare,
  CalendarClock,
  ExternalLink,
  User,
  Eye,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { toast } from "react-toastify";
import {
  type ImportedCustomer,
  type AssignedStaff,
  type ImportedCustomerActivity,
  adminSummarizeLeadComment,
} from "@/utils/apis/adminPlatformLeadsApi";
import {
  isMissedFollowUp,
  isNewPlatformLead,
  isSchedulableStatus,
  getTodayString,
  FOLLOW_UP_WARNING_MESSAGE,
} from "@/utils/helpers/followUp";
import {
  buildWhatsAppUrl,
  formatPhoneWithCountryCode,
} from "@/components/table/tableColumns/AdminPlatformLeadsTableColumn";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LeadActivityModalProps {
  customer: ImportedCustomer | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (payload: {
    status: string;
    comment: string;
    scheduledDate?: string;
  }) => void;
  onAssignStaff?: (id: string, staffId: string | null) => void;
  isSaving?: boolean;
  isAdmin?: boolean;
  staffList?: AssignedStaff[];
  currentUserName?: string;
}

type Tab = "update" | "history" | "details";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  "Pending",
  "Contacted",
  "Re-contacted",
  "Need Follow Up",
  "Not Interested",
  "Processing Application",
  "Rejected Application",
  "Completed",
];

const STATUS_STYLES: Record<string, { pill: string; dot: string }> = {
  Pending: {
    pill: "bg-yellow-100 text-yellow-800 border-yellow-300",
    dot: "bg-yellow-400",
  },
  Contacted: {
    pill: "bg-blue-100 text-blue-800 border-blue-300",
    dot: "bg-blue-400",
  },
  "Re-contacted": {
    pill: "bg-cyan-100 text-cyan-800 border-cyan-300",
    dot: "bg-cyan-400",
  },
  Recontacted: {
    pill: "bg-cyan-100 text-cyan-800 border-cyan-300",
    dot: "bg-cyan-400",
  },
  "Need Follow Up": {
    pill: "bg-orange-100 text-orange-800 border-orange-300",
    dot: "bg-orange-400",
  },
  "Not Interested": {
    pill: "bg-gray-100 text-gray-700 border-gray-300",
    dot: "bg-gray-400",
  },
  "Processing Application": {
    pill: "bg-purple-100 text-purple-800 border-purple-300",
    dot: "bg-purple-400",
  },
  "Rejected Application": {
    pill: "bg-red-100 text-red-800 border-red-300",
    dot: "bg-red-400",
  },
  Completed: {
    pill: "bg-green-100 text-green-800 border-green-300",
    dot: "bg-green-400",
  },
};

const TIMELINE_ICON_STYLES: Record<string, string> = {
  status: "bg-blue-100 text-blue-700 border-blue-300",
  comment: "bg-violet-100 text-violet-700 border-violet-300",
  schedule: "bg-amber-100 text-amber-700 border-amber-300",
  state: "bg-teal-100 text-teal-700 border-teal-300",
  assignment: "bg-purple-100 text-purple-700 border-purple-300",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const formatDay = (value?: string) => {
  if (!value) return "";
  const d = new Date(value);
  return isNaN(d.getTime())
    ? value
    : d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const getFutureDateString = (daysFromToday: number = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().split("T")[0];
};

const formatSchedulePreview = (dateStr: string): string => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const today = getTodayString();
  const tomorrow = getFutureDateString(1);
  let prefix = "";
  if (dateStr === today) prefix = "Today, ";
  else if (dateStr === tomorrow) prefix = "Tomorrow, ";
  return `${prefix}${d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;
};

const DATE_SHORTCUTS = [
  { label: "Today", days: 0 },
  { label: "Tomorrow", days: 1 },
  { label: "+2 Days", days: 2 },
  { label: "+3 Days", days: 3 },
  { label: "+1 Week", days: 7 },
];

const StatusPill: React.FC<{ status?: string }> = ({ status }) => {
  const styles =
    STATUS_STYLES[status || ""] || STATUS_STYLES["Not Interested"];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full border ${styles.pill}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {status || "—"}
    </span>
  );
};

const TimelineIconNode: React.FC<{ type: string }> = ({ type }) => {
  const icons: Record<string, React.ReactNode> = {
    status: <RefreshCw className="w-3 h-3" />,
    comment: <MessageSquare className="w-3 h-3" />,
    schedule: <CalendarClock className="w-3 h-3" />,
    state: <MapPin className="w-3 h-3" />,
    assignment: <UserCheck className="w-3 h-3" />,
  };
  return <>{icons[type] || <History className="w-3 h-3" />}</>;
};

const InfoField: React.FC<{ label: string; value?: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
      {label}
    </p>
    <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">
      {value || <span className="text-gray-400 font-normal">N/A</span>}
    </div>
  </div>
);

const CommentPopover: React.FC<{ text: string; date?: string }> = ({
  text,
  date,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium text-violet-700 dark:text-violet-300 bg-violet-100/80 dark:bg-violet-950/60 hover:bg-violet-200/80 dark:hover:bg-violet-900/60 border border-violet-200 dark:border-violet-800 transition-colors cursor-pointer select-none"
          title="View full comment"
        >
          <Eye className="w-3 h-3" />
          <span>View</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="z-[70] w-80 sm:w-96 max-w-[90vw] p-3.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl rounded-xl"
        align="start"
        side="bottom"
        sideOffset={6}
      >
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-gray-800">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400">
            <MessageSquare className="w-3.5 h-3.5" /> Full Comment
          </span>
          {date && (
            <span className="text-[10px] text-gray-400">
              {formatDateTime(date)}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words max-h-60 overflow-y-auto leading-relaxed bg-gray-50/70 dark:bg-gray-950/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
          {text}
        </div>
      </PopoverContent>
    </Popover>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const LeadActivityModal: React.FC<LeadActivityModalProps> = ({
  customer,
  isOpen,
  onClose,
  onUpdate,
  onAssignStaff,
  isSaving = false,
  isAdmin = false,
  staffList = [],
  currentUserName = "",
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("update");
  const [status, setStatus] = useState("Pending");
  const [comment, setComment] = useState("");
  const [previousComment, setPreviousComment] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    if (customer) {
      setStatus(customer.status || "Pending");
      setComment(customer.comment || "");
      setPreviousComment("");
      setScheduledDate(
        customer.scheduledDate
          ? new Date(customer.scheduledDate).toISOString().split("T")[0]
          : ""
      );
      setActiveTab("update");
    }
  }, [customer?._id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen || !customer) return null;

  const isRecontact = status === "Re-contacted" || status === "Recontacted";
  const isScheduleStatus = isSchedulableStatus(status);
  const missedFollowUp = isMissedFollowUp(status, scheduledDate);

  const scheduleTheme = isRecontact
    ? {
        title: "Schedule Next Re-contact Date",
        badge: "Re-contact Schedule",
        containerCls:
          "border-2 border-cyan-400 dark:border-cyan-600 bg-gradient-to-br from-cyan-50/90 via-sky-50/50 to-blue-50/30 dark:from-cyan-950/40 dark:via-sky-950/20 dark:to-blue-950/20 ring-2 ring-cyan-400/20 shadow-xs",
        badgeCls:
          "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700",
        iconCls: "text-cyan-600 dark:text-cyan-400",
        activeChipCls: "bg-cyan-600 text-white border-cyan-600 shadow-xs",
        chipCls:
          "bg-white/90 dark:bg-gray-800 border-cyan-200 dark:border-cyan-800 text-cyan-900 dark:text-cyan-200 hover:bg-cyan-100/70 dark:hover:bg-cyan-900/40",
        inputFocusCls: "focus:ring-cyan-500/30 focus:border-cyan-500",
        dateBannerCls:
          "bg-cyan-100/80 text-cyan-900 dark:bg-cyan-900/50 dark:text-cyan-200 border-cyan-200 dark:border-cyan-800",
      }
    : {
        title: "Schedule Next Follow-up Date",
        badge: "Follow-up Schedule",
        containerCls:
          "border-2 border-amber-400 dark:border-amber-600 bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-yellow-50/30 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-yellow-950/20 ring-2 ring-amber-400/20 shadow-xs",
        badgeCls:
          "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border-amber-300 dark:border-amber-700",
        iconCls: "text-amber-600 dark:text-amber-400",
        activeChipCls: "bg-amber-600 text-white border-amber-600 shadow-xs",
        chipCls:
          "bg-white/90 dark:bg-gray-800 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 hover:bg-amber-100/70 dark:hover:bg-amber-900/40",
        inputFocusCls: "focus:ring-amber-500/30 focus:border-amber-500",
        dateBannerCls:
          "bg-amber-100/80 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200 border-amber-200 dark:border-amber-800",
      };
  const isNew = isNewPlatformLead(customer);
  const whatsappUrl = buildWhatsAppUrl(customer.phone, customer.name, currentUserName);
  const assignedStaffObj =
    typeof customer.assignedTo === "object" && customer.assignedTo
      ? customer.assignedTo
      : null;
  const assignedStaffId =
    assignedStaffObj?._id ||
    (typeof customer.assignedTo === "string" ? customer.assignedTo : "");

  // Build sorted timeline
  const timeline: Array<{
    key: string;
    at: string;
    type: string;
    item: ImportedCustomerActivity | "created";
  }> = [
    { key: "created", at: customer.createdAt, type: "created", item: "created" as const },
    ...(customer.activityLog || []).map((a, i) => ({
      key: `${a.type}-${a.at}-${i}`,
      at: a.at,
      type: a.type,
      item: a,
    })),
  ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  const handleSummarize = async () => {
    if (!comment.trim()) {
      toast.info("Please add some text in the comment box first.");
      return;
    }
    try {
      setIsSummarizing(true);
      const original = comment;
      const summary = await adminSummarizeLeadComment(original);
      setPreviousComment(original);
      setComment(summary);
    } catch (err: any) {
      toast.error(err.message || "Failed to summarize with AI.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "update",
      label: "Update Lead",
      icon: <MessageSquarePlus className="w-3.5 h-3.5" />,
    },
    {
      id: "history",
      label: "History",
      icon: <History className="w-3.5 h-3.5" />,
    },
    {
      id: "details",
      label: "Candidate Info",
      icon: <User className="w-3.5 h-3.5" />,
    },
  ];

  const handleSave = () => {
    if (isScheduleStatus && !scheduledDate) {
      toast.warning(`Please select a scheduled date for ${status}.`);
      return;
    }
    onUpdate({
      status,
      comment,
      scheduledDate: isScheduleStatus ? scheduledDate : scheduledDate || undefined,
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal wrapper */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto relative w-full max-w-4xl lg:max-w-5xl h-[650px] max-h-[92vh] flex flex-col bg-white dark:bg-gray-950 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div className="flex items-start gap-3 px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-blue-50/60 to-indigo-50/40 dark:from-blue-950/20 dark:to-indigo-950/10 shrink-0">
            {/* Avatar */}
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm select-none">
              {customer.name?.charAt(0)?.toUpperCase() || "?"}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-gray-900 dark:text-white truncate">
                  {customer.name}
                </h2>
                {isNew && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded tracking-wide uppercase">
                    New
                  </span>
                )}
                <StatusPill status={customer.status} />
              </div>
              <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 mt-1">
                {customer.phone && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                  >
                    <IconBrandWhatsapp size={12} className="text-[#25D366]" />
                    {formatPhoneWithCountryCode(customer.phone)}
                  </a>
                )}
                {customer.state && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    {customer.state}
                  </span>
                )}
                {customer.email && (
                  <a
                    href={`mailto:${customer.email}`}
                    className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline"
                  >
                    <Mail className="w-3 h-3" />
                    {customer.email}
                  </a>
                )}
                {customer.linkedinUrl && (
                  <a
                    href={customer.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" /> LinkedIn
                  </a>
                )}
              </div>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Tabs ── */}
          <div className="flex border-b border-gray-100 dark:border-gray-800 shrink-0 bg-white dark:bg-gray-950">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
              >
                {tab.icon}
                {tab.label}
                {tab.id === "history" && timeline.length > 1 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    {timeline.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Body ── */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {/* ─ Update Activity ─ */}
            {activeTab === "update" && (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* ── Left Column: Status & Schedule ── */}
                <div className="space-y-4">
                  {/* Status Picker */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                      Contact Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {STATUS_OPTIONS.map((opt) => {
                        const styles =
                          STATUS_STYLES[opt] || STATUS_STYLES["Not Interested"];
                        const isSelected = status === opt;
                        const isTargetSchedulable =
                          opt === "Re-contacted" || opt === "Need Follow Up";
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setStatus(opt);
                              if (
                                isTargetSchedulable &&
                                (!scheduledDate || scheduledDate < getTodayString())
                              ) {
                                setScheduledDate(getFutureDateString(1));
                              }
                            }}
                            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left ${
                              isSelected
                                ? `${styles.pill} border-current ring-2 ring-offset-1 ring-current/20 shadow-sm`
                                : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900"
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                isSelected
                                  ? styles.dot
                                  : "bg-gray-300 dark:bg-gray-600"
                              }`}
                            />
                            <span className="truncate">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Highlighted Schedule Section (for Re-contacted and Need Follow Up) */}
                  {isScheduleStatus && (
                    <div className={`p-4 rounded-2xl transition-all ${scheduleTheme.containerCls}`}>
                      {/* Header */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-white/90 dark:bg-gray-800 shadow-2xs">
                            <CalendarClock className={`w-4 h-4 ${scheduleTheme.iconCls}`} />
                          </div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
                            {scheduleTheme.title}
                          </h4>
                        </div>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full border tracking-wide uppercase shrink-0 ${scheduleTheme.badgeCls}`}
                        >
                          {scheduleTheme.badge}
                        </span>
                      </div>

                      {/* Quick Shortcuts Chips */}
                      <div className="mt-2.5 mb-2.5">
                        {scheduledDate && (
                          <div className="flex justify-end mb-1">
                            <button
                              type="button"
                              onClick={() => setScheduledDate("")}
                              className="text-[10px] text-gray-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-0.5 transition-colors cursor-pointer"
                              title="Clear date"
                            >
                              <X className="w-3 h-3" /> Clear
                            </button>
                          </div>
                        )}
                        <div className="flex flex-wrap items-center gap-1.5">
                          {DATE_SHORTCUTS.map((sc) => {
                            const target = getFutureDateString(sc.days);
                            const isSelected = scheduledDate === target;
                            return (
                              <button
                                key={sc.label}
                                type="button"
                                onClick={() => setScheduledDate(target)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer active:scale-95 ${
                                  isSelected
                                    ? scheduleTheme.activeChipCls
                                    : scheduleTheme.chipCls
                                }`}
                              >
                                {sc.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Date Picker Input */}
                      <div className="relative mt-2">
                        <CalendarCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className={`w-full pl-9 pr-3 py-2 text-sm font-medium rounded-xl border bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                            missedFollowUp
                              ? "border-red-400 bg-red-50/60 dark:border-red-800 dark:bg-red-950/20"
                              : !scheduledDate
                              ? "border-amber-400/80 dark:border-amber-600/80 animate-pulse"
                              : `border-gray-200 dark:border-gray-700 ${scheduleTheme.inputFocusCls}`
                          }`}
                        />
                      </div>

                      {/* Formatted Date Confirmation */}
                      {scheduledDate && !missedFollowUp && (
                        <div
                          className={`mt-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${scheduleTheme.dateBannerCls}`}
                        >
                          <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            📅 Next call scheduled:{" "}
                            <strong>{formatSchedulePreview(scheduledDate)}</strong>
                          </span>
                        </div>
                      )}

                      {/* Missing Date Notice */}
                      {!scheduledDate && (
                        <div className="mt-2.5 flex items-center gap-1.5 px-3 py-2 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                          <span>
                            Please select a date so this lead appears in your scheduled call queue.
                          </span>
                        </div>
                      )}

                      {/* Missed / Past Date Warning */}
                      {missedFollowUp && (
                        <div className="mt-2.5 flex items-start gap-2 px-3 py-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-xs font-medium text-red-700 dark:text-red-400">
                          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span>{FOLLOW_UP_WARNING_MESSAGE}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Optional note when date exists on non-schedule status */}
                  {!isScheduleStatus && scheduledDate && (
                    <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <CalendarCheck className="w-3.5 h-3.5 text-gray-400" />
                        <span>
                          Existing scheduled date:{" "}
                          <strong className="text-gray-700 dark:text-gray-300">
                            {formatSchedulePreview(scheduledDate)}
                          </strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setScheduledDate("")}
                        className="text-[11px] text-red-500 hover:text-red-700 hover:underline font-medium cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* ── Right Column: Notes, Staff & Save ── */}
                <div className="flex flex-col justify-between space-y-3.5 h-full">
                  {/* Comment / Notes */}
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-2 shrink-0">
                      <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        Activity Notes / Comment
                      </label>
                      <button
                        type="button"
                        onClick={handleSummarize}
                        disabled={isSummarizing || !comment.trim()}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
                        title="Paste a WhatsApp conversation and let AI summarize it"
                      >
                        {isSummarizing ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Summarizing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-amber-300" />
                            AI Summarize
                          </>
                        )}
                      </button>
                    </div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add follow-up notes, paste a WhatsApp conversation to summarize, or record any activity..."
                      className="w-full flex-1 min-h-[180px] p-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all resize-none placeholder:text-gray-400 leading-relaxed"
                    />
                    {previousComment && previousComment !== comment && (
                      <div className="flex items-center justify-between mt-1.5 shrink-0">
                        <span className="text-[11px] text-gray-400">
                          Summarized with AI
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setComment(previousComment);
                            setPreviousComment("");
                          }}
                          className="inline-flex items-center gap-1 text-[11px] text-violet-600 dark:text-violet-400 hover:underline font-medium cursor-pointer"
                        >
                          <Undo2 className="w-3 h-3" /> Undo summary
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Assign Staff (admin only) */}
                  {isAdmin && onAssignStaff && (
                    <div className="shrink-0">
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                        Assign To Staff
                      </label>
                      <div className="relative">
                        <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                          defaultValue={assignedStaffId}
                          onChange={(e) =>
                            onAssignStaff(customer._id, e.target.value || null)
                          }
                          className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer"
                        >
                          <option value="">Unassigned</option>
                          {staffList.map((s) => (
                            <option key={s._id} value={s._id}>
                              {s.fullName || s.username}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Save */}
                  <div className="shrink-0 pt-1">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" /> Save Activity
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ─ History Tab ─ */}
            {activeTab === "history" && (
              <div className="p-5">
                {timeline.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    No activity history yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {timeline.map((t) => {
                      const isCreated = t.type === "created";
                      const act = isCreated
                        ? null
                        : (t.item as ImportedCustomerActivity);
                      const iconClass = isCreated
                        ? "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                        : TIMELINE_ICON_STYLES[t.type] ||
                          "bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";

                      return (
                        <div
                          key={t.key}
                          className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50/90 dark:hover:bg-gray-900/80 transition-all shadow-2xs"
                        >
                          {/* Icon badge */}
                          <span
                            className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-lg border shadow-xs ${iconClass}`}
                          >
                            {isCreated ? (
                              <UserPlus className="w-3.5 h-3.5" />
                            ) : (
                              <TimelineIconNode type={t.type} />
                            )}
                          </span>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 dark:text-gray-100 leading-snug">
                              {isCreated && (
                                <span className="flex items-center flex-wrap gap-1">
                                  <span>Added to contact list</span>
                                  {customer.source && (
                                    <span className="text-[11px] text-gray-400 font-normal">
                                      via {customer.source}
                                    </span>
                                  )}
                                </span>
                              )}
                              {act?.type === "status" && (
                                <span className="flex items-center flex-wrap gap-1.5">
                                  <span>Status changed</span>
                                  <StatusPill status={act.from} />
                                  <span className="text-gray-400">→</span>
                                  <StatusPill status={act.to} />
                                </span>
                              )}
                              {act?.type === "comment" && (
                                <div className="flex items-center flex-wrap gap-2">
                                  <span>
                                    {act.to
                                      ? "Comment updated"
                                      : "Comment removed"}
                                  </span>
                                  {act.to && (
                                    <CommentPopover text={act.to} date={t.at} />
                                  )}
                                </div>
                              )}
                              {act?.type === "schedule" && (
                                <span>
                                  {act.to
                                    ? act.from
                                      ? `Rescheduled: ${formatDay(act.from)} → ${formatDay(act.to)}`
                                      : `Scheduled for ${formatDay(act.to)}`
                                    : "Schedule date cleared"}
                                </span>
                              )}
                              {act?.type === "state" && (
                                <span>
                                  State{" "}
                                  {act.from
                                    ? `changed: ${act.from} → ${act.to || "N/A"}`
                                    : `set to ${act.to || "N/A"}`}
                                </span>
                              )}
                              {act?.type === "assignment" && (
                                <span>
                                  {act.to === "Unassigned"
                                    ? "Contact unassigned"
                                    : `Assigned to ${act.to}`}
                                </span>
                              )}
                            </div>
                            <time className="block mt-1 text-[11px] text-gray-400">
                              {formatDateTime(t.at)}
                            </time>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ─ Candidate Info Tab ─ */}
            {activeTab === "details" && (
              <div className="p-6 space-y-5">
                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                  <InfoField label="Full Name" value={customer.name} />
                  <InfoField label="State" value={customer.state} />
                  <InfoField
                    label="Phone"
                    value={
                      customer.phone ? (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                        >
                          <IconBrandWhatsapp
                            size={14}
                            className="text-[#25D366]"
                          />
                          {formatPhoneWithCountryCode(customer.phone)}
                        </a>
                      ) : undefined
                    }
                  />
                  <InfoField
                    label="Email"
                    value={
                      customer.email ? (
                        <a
                          href={`mailto:${customer.email}`}
                          className="text-blue-500 hover:underline break-all text-sm"
                        >
                          {customer.email}
                        </a>
                      ) : undefined
                    }
                  />
                  <InfoField label="Source" value={customer.source} />
                  <InfoField
                    label="Added On"
                    value={formatDay(customer.createdAt)}
                  />
                  {customer.linkedinUrl && (
                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                        LinkedIn
                      </p>
                      <a
                        href={customer.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        {customer.linkedinUrl}
                      </a>
                    </div>
                  )}
                  <div className="col-span-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">
                      Assigned Staff
                    </p>
                    <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {assignedStaffObj
                        ? assignedStaffObj.fullName || assignedStaffObj.username
                        : "Unassigned"}
                    </p>
                  </div>
                </div>

                {/* Designations */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" /> Designations / Roles
                  </p>
                  {customer.designations?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {customer.designations.map((d, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      No designations listed.
                    </p>
                  )}
                </div>

                {/* Resume */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Resume / CV
                    </p>
                    <div className="flex items-center gap-2">
                      {customer.cvUrl && (
                        <a
                          href={customer.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          <ExternalLink className="w-3 h-3" /> Open
                        </a>
                      )}
                    </div>
                  </div>

                  {customer.cvUrl ? (
                    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xs">
                      <iframe
                        src={
                          customer.cvUrl.includes("drive.google.com")
                            ? customer.cvUrl.replace(
                                /\/view(\?.*)?$/,
                                "/preview$1"
                              )
                            : customer.cvUrl
                        }
                        className="w-full h-[520px] bg-gray-50 dark:bg-gray-900"
                        title="Resume Preview"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/60 dark:bg-gray-900/40">
                      <FileText className="w-8 h-8 text-gray-200 shrink-0" />
                      <p className="text-sm text-gray-400">
                        No resume uploaded.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>


        </div>
      </div>
    </>
  );
};

export default LeadActivityModal;
