import React from "react";
import { Eye, AlertTriangle, X } from "lucide-react";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { 
  type ImportedCustomer, 
  type AssignedStaff 
} from "@/utils/apis/adminPlatformLeadsApi";
import { isMissedFollowUp, FOLLOW_UP_WARNING_MESSAGE, isNewPlatformLead } from "@/utils/helpers/followUp";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export interface AdminPlatformLeadsColumnsOptions {
  hideEmail?: boolean;
  hideAssignStaff?: boolean;
  hideComment?: boolean;
  hideScheduledDate?: boolean;
  staffList?: AssignedStaff[];
  onAssignStaff?: (id: string, staffId: string | null) => void;
  isAdmin?: boolean;
  staffName?: string;
}

export const formatPhoneWithCountryCode = (phone: string): string => {
  if (!phone) return "";
  const trimmed = phone.trim();
  if (trimmed.startsWith("+")) return trimmed;
  if (trimmed.startsWith("-")) {
    const withoutDash = trimmed.replace(/^-+/, "");
    return withoutDash.startsWith("+") ? withoutDash : `+${withoutDash}`;
  }

  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return trimmed;

  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return `+91${digits.slice(1)}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }
  if (digits.length > 10) {
    return `+${digits}`;
  }

  return `+91${digits}`;
};

export const buildWhatsAppUrl = (phone: string, customerName?: string, staffName?: string): string => {
  if (!phone) return "";
  const formatted = formatPhoneWithCountryCode(phone);
  const cleanDigits = formatted.replace(/\D/g, "");
  if (!cleanDigits) return "";
  
  const greeting = customerName?.trim() ? `Hello ${customerName.trim()},` : "Hello,";
  const staffIntro = staffName?.trim() 
    ? `I am ${staffName.trim()} from SS HR Consultancy`
    : "I am from SS HR Consultancy";
  const message = `${greeting} ${staffIntro}`;
  
  return `https://wa.me/${cleanDigits}?text=${encodeURIComponent(message)}`;
};

export const STATUS_STYLES: Record<string, { pill: string; dot: string }> = {
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

export const STATUS_TEXT_COLORS: Record<string, string> = {
  Pending: "text-amber-700 dark:text-amber-400",
  Contacted: "text-blue-700 dark:text-blue-400",
  "Re-contacted": "text-cyan-700 dark:text-cyan-400",
  Recontacted: "text-cyan-700 dark:text-cyan-400",
  "Need Follow Up": "text-orange-700 dark:text-orange-400",
  "Not Interested": "text-gray-600 dark:text-gray-400",
  "Processing Application": "text-purple-700 dark:text-purple-400",
  "Rejected Application": "text-red-700 dark:text-red-400",
  Completed: "text-emerald-700 dark:text-emerald-400",
};

interface LeadCommentCellProps {
  comment: string;
}

const LeadCommentCell: React.FC<LeadCommentCellProps> = ({ comment }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const trimmedComment = (comment || "").trim();

  if (!trimmedComment) {
    return (
      <div className="text-gray-400 dark:text-gray-500 text-xs text-center w-full select-none">
        —
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="group flex items-center justify-between gap-1.5 max-w-[180px] sm:max-w-[220px] w-full text-left px-2 py-1 rounded-md bg-gray-50/70 dark:bg-gray-800/40 hover:bg-blue-50/90 dark:hover:bg-blue-950/40 border border-gray-200/80 hover:border-blue-300 dark:border-gray-800 dark:hover:border-blue-700 transition-all cursor-pointer focus:outline-none"
          title="Click to view full comment"
        >
          <span className="truncate text-xs text-gray-700 dark:text-gray-300 font-normal group-hover:text-blue-700 dark:group-hover:text-blue-300 flex-1">
            {trimmedComment}
          </span>
          <Eye className="w-3.5 h-3.5 text-blue-500 group-hover:text-blue-700 shrink-0 transition-colors" />
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
          <div className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed max-h-[260px] overflow-y-auto whitespace-pre-wrap break-words select-text">
            {trimmedComment}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const AdminPlatformLeadsTableColumns = (
  onView: (customer: ImportedCustomer) => void,
  onUpdateStatus: (id: string, newStatus: string, comment: string, scheduledDate?: string, state?: string, assignedTo?: string | null) => void,
  options: AdminPlatformLeadsColumnsOptions = { hideEmail: true }
): ColumnDef<ImportedCustomer>[] => {
  const columns: ColumnDef<ImportedCustomer>[] = [
  {
    id: "serialNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sr. No." />
    ),
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return <div className="font-medium text-gray-500">{pageIndex * pageSize + row.index + 1}</div>;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" className="justify-start text-left pl-1" />
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const linkedinUrl = row.original.linkedinUrl;
      const isNew = isNewPlatformLead(row.original);

      return (
        <div className="font-medium flex items-center justify-start gap-2 text-left w-full pl-1">
          <span className="truncate">{name}</span>
          {isNew && (
            <span
              className="inline-flex items-center px-1 py-0 rounded text-[7px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 tracking-tight uppercase shrink-0 leading-tight"
              title="New lead"
            >
              New
            </span>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3b82f6] hover:text-blue-700 transition-colors shrink-0"
              title="View LinkedIn Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[14px] w-[14px]">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div className="text-center w-full flex justify-center">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      const phone = (row.getValue("phone") as string) || "";
      if (!phone) return <div className="text-gray-400 text-center w-full">N/A</div>;
      
      const customerName = row.original.name || "";
      const assignedStaff = typeof row.original.assignedTo === "object" && row.original.assignedTo
        ? (row.original.assignedTo.fullName || row.original.assignedTo.username)
        : "";
      const effectiveStaffName = options.staffName || assignedStaff || "";
      const whatsappUrl = buildWhatsAppUrl(phone, customerName, effectiveStaffName);
      const displayPhone = formatPhoneWithCountryCode(phone);

      return (
        <div className="flex items-center justify-center w-full">
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30 transition-colors font-medium text-xs whitespace-nowrap group"
            title={`Send WhatsApp message to ${customerName || displayPhone}`}
          >
            <IconBrandWhatsapp size={16} className="text-[#25D366] shrink-0 group-hover:scale-110 transition-transform" />
            <span className="underline-offset-2 hover:underline">{displayPhone}</span>
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "state",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State" />
    ),
    cell: ({ row }) => {
      const initialState = row.getValue("state") as string || "";
      const status = row.getValue("status") as string || "Pending";
      const comment = row.getValue("comment") as string || "";
      const customerId = row.original._id;
      const initialDate = row.original.scheduledDate;
      const formattedInitialDate = initialDate ? new Date(initialDate).toISOString().split('T')[0] : "";
      const [localState, setLocalState] = React.useState(initialState);

      React.useEffect(() => {
        setLocalState(initialState);
      }, [initialState]);

      return (
        <input 
          value={localState}
          onChange={(e) => setLocalState(e.target.value)}
          onBlur={() => {
            if (localState !== initialState) {
              onUpdateStatus(customerId, status, comment, formattedInitialDate, localState);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              if (localState !== initialState) {
                onUpdateStatus(customerId, status, comment, formattedInitialDate, localState);
              }
            }
          }}
          className="w-full min-w-[100px] text-center px-2 py-1.5 text-sm border border-transparent hover:border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-transparent rounded-md transition-all placeholder:text-gray-400"
          placeholder="N/A"
        />
      );
    },
  },
  {
    accessorKey: "assignedTo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Assigned Staff" />
    ),
    cell: ({ row }) => {
      const customerId = row.original._id;
      const currentAssigned = row.original.assignedTo;
      const currentStaffId = typeof currentAssigned === "object" && currentAssigned !== null
        ? currentAssigned._id
        : (typeof currentAssigned === "string" ? currentAssigned : "");

      const [selectedStaff, setSelectedStaff] = React.useState(currentStaffId || "");

      React.useEffect(() => {
        setSelectedStaff(currentStaffId || "");
      }, [currentStaffId]);

      // If not admin and no assignment callback provided, display clean badge
      if (!options.isAdmin && !options.onAssignStaff) {
        const staffObj = typeof currentAssigned === "object" && currentAssigned !== null ? currentAssigned : null;
        return (
          <div className="flex items-center justify-center">
            {staffObj ? (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {staffObj.fullName || staffObj.username}
              </span>
            ) : (
              <span className="text-xs text-gray-400">Unassigned</span>
            )}
          </div>
        );
      }

      return (
        <div className="flex items-center justify-center">
          <select
            value={selectedStaff}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedStaff(val);
              if (options.onAssignStaff) {
                options.onAssignStaff(customerId, val || null);
              } else {
                onUpdateStatus(
                  customerId,
                  row.original.status || "Pending",
                  row.original.comment || "",
                  row.original.scheduledDate ? new Date(row.original.scheduledDate).toISOString().split('T')[0] : "",
                  row.original.state || "",
                  val || null
                );
              }
            }}
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border transition-all cursor-pointer outline-none ${
              selectedStaff
                ? "bg-purple-100 text-purple-700 border-purple-200 hover:border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
                : "bg-gray-100 text-gray-500 border-gray-200 hover:border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
            }`}
          >
            <option value="" className="bg-white text-gray-700">Unassigned</option>
            {(options.staffList || []).map((s) => (
              <option key={s._id} value={s._id} className="bg-white text-gray-900 font-medium">
                {s.fullName || s.username}
              </option>
            ))}
          </select>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = (row.getValue("status") as string) || "Pending";
      const textCls = STATUS_TEXT_COLORS[status] || "text-gray-700 dark:text-gray-300";

      return (
        <div className="flex items-center justify-center text-xs font-semibold select-none">
          <span className={textCls}>{status}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "comment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comment" />
    ),
    cell: ({ row }) => {
      const comment = (row.getValue("comment") as string) || "";
      return <LeadCommentCell comment={comment} />;
    },
  },
  {
    accessorKey: "scheduledDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Scheduled Date" />
    ),
    cell: ({ row }) => {
      const initialDate = row.original.scheduledDate;
      const status = row.getValue("status") as string || "Pending";
      const comment = row.getValue("comment") as string || "";
      const customerId = row.original._id;
      
      const formattedInitial = initialDate ? new Date(initialDate).toISOString().split('T')[0] : "";
      const [localDate, setLocalDate] = React.useState(formattedInitial);

      React.useEffect(() => {
        setLocalDate(formattedInitial);
      }, [formattedInitial]);

      // Calculate today's date in YYYY-MM-DD format based on local time, or just use string comparison with UTC format if the app uses UTC dates.
      // Since formattedInitial uses toISOString (UTC), let's compare with today's UTC toISOString.
      const today = new Date().toISOString().split('T')[0];
      const isToday = localDate === today;

      const missedFollowUp = isMissedFollowUp(status, localDate);

      return (
        <div className="flex flex-col items-center gap-0.5 w-full">
          <input 
            type="date"
            value={localDate}
            onChange={(e) => {
              setLocalDate(e.target.value);
              onUpdateStatus(customerId, status, comment, e.target.value);
            }}
            className={`w-full min-w-[130px] text-center px-2 py-1.5 text-sm border hover:border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-transparent rounded-md transition-all ${missedFollowUp ? 'border-red-300 bg-red-50/60' : 'border-transparent'} ${isToday ? 'text-red-600 font-semibold' : 'text-gray-700'}`}
          />
          {missedFollowUp && (
            <span
              className="flex items-center gap-1 text-[11px] font-medium text-red-600 leading-tight"
              title={FOLLOW_UP_WARNING_MESSAGE}
            >
              <AlertTriangle className="w-3 h-3 shrink-0" />
              Add a future date
            </span>
          )}
        </div>
      );
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <button
          onClick={() => onView(row.original)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 transition-colors mx-auto cursor-pointer"
        >
          <Eye className="h-3.5 w-3.5" /> Update Lead
        </button>
      );
    },
  },
];

  let result = columns;

  if (options?.hideEmail !== false) {
    result = result.filter((col) => ("accessorKey" in col ? col.accessorKey !== "email" : true));
  }

  if (options?.hideAssignStaff) {
    result = result.filter((col) => ("accessorKey" in col ? col.accessorKey !== "assignedTo" : true));
  }

  if (options?.hideComment) {
    result = result.filter((col) => ("accessorKey" in col ? col.accessorKey !== "comment" : true));
  }

  if (options?.hideScheduledDate) {
    result = result.filter((col) => ("accessorKey" in col ? col.accessorKey !== "scheduledDate" : true));
  }

  return result;
};
