import React from "react";
import { UserPlus, RefreshCw, MessageSquare, CalendarClock, MapPin, UserCheck, Eye } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ImportedCustomer, ImportedCustomerActivity } from "@/utils/apis/adminPlatformLeadsApi";

const STATUS_DOT: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Contacted: "bg-blue-100 text-blue-700 border-blue-300",
  "Re-contacted": "bg-cyan-100 text-cyan-700 border-cyan-300",
  Recontacted: "bg-cyan-100 text-cyan-700 border-cyan-300",
  "Need Follow Up": "bg-orange-100 text-orange-700 border-orange-300",
  "Not Interested": "bg-gray-100 text-gray-700 border-gray-300",
  "Processing Application": "bg-purple-100 text-purple-700 border-purple-300",
  "Rejected Application": "bg-red-100 text-red-700 border-red-300",
  Completed: "bg-green-100 text-green-700 border-green-300",
};

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
    : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const StatusPill: React.FC<{ status?: string }> = ({ status }) => (
  <span
    className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-full border ${
      STATUS_DOT[status || ""] || "bg-gray-100 text-gray-700 border-gray-300"
    }`}
  >
    {status || "—"}
  </span>
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

interface TimelineItem {
  key: string;
  at: string;
  icon: React.ReactNode;
  iconClass: string;
  title: React.ReactNode;
  body?: React.ReactNode;
}

const buildItems = (customer: ImportedCustomer): TimelineItem[] => {
  const items: TimelineItem[] = [
    {
      key: "created",
      at: customer.createdAt,
      icon: <UserPlus className="w-3.5 h-3.5" />,
      iconClass: "bg-emerald-100 text-emerald-700 border-emerald-300",
      title: <span className="font-medium">Added to contact list</span>,
      body: customer.source ? (
        <span className="text-xs text-gray-500">Source: {customer.source}</span>
      ) : undefined,
    },
  ];

  (customer.activityLog || []).forEach((a: ImportedCustomerActivity, idx: number) => {
    const key = `${a.type}-${a.at}-${idx}`;
    switch (a.type) {
      case "status":
        items.push({
          key,
          at: a.at,
          icon: <RefreshCw className="w-3.5 h-3.5" />,
          iconClass: "bg-blue-100 text-blue-700 border-blue-300",
          title: (
            <span className="flex flex-wrap items-center gap-1.5 font-medium">
              Status changed <StatusPill status={a.from} />
              <span className="text-gray-400">→</span>
              <StatusPill status={a.to} />
            </span>
          ),
        });
        break;
      case "comment":
        items.push({
          key,
          at: a.at,
          icon: <MessageSquare className="w-3.5 h-3.5" />,
          iconClass: "bg-violet-100 text-violet-700 border-violet-300",
          title: (
            <div className="flex items-center flex-wrap gap-2 font-medium">
              <span>{a.to ? "Comment updated" : "Comment removed"}</span>
              {a.to && <CommentPopover text={a.to} date={a.at} />}
            </div>
          ),
        });
        break;
      case "schedule":
        items.push({
          key,
          at: a.at,
          icon: <CalendarClock className="w-3.5 h-3.5" />,
          iconClass: "bg-amber-100 text-amber-700 border-amber-300",
          title: (
            <span className="font-medium">
              {a.to
                ? a.from
                  ? `Rescheduled from ${formatDay(a.from)} to ${formatDay(a.to)}`
                  : `Scheduled for ${formatDay(a.to)}`
                : "Schedule date cleared"}
            </span>
          ),
        });
        break;
      case "state":
        items.push({
          key,
          at: a.at,
          icon: <MapPin className="w-3.5 h-3.5" />,
          iconClass: "bg-teal-100 text-teal-700 border-teal-300",
          title: (
            <span className="font-medium">
              State {a.from ? `changed from ${a.from} to ${a.to || "N/A"}` : `set to ${a.to || "N/A"}`}
            </span>
          ),
        });
        break;
      case "assignment":
        items.push({
          key,
          at: a.at,
          icon: <UserCheck className="w-3.5 h-3.5" />,
          iconClass: "bg-purple-100 text-purple-700 border-purple-300",
          title: (
            <span className="font-medium">
              {a.to === "Unassigned"
                ? "Contact unassigned"
                : `Contact assigned to ${a.to}`}
            </span>
          ),
        });
        break;
    }
  });

  return items.sort((x, y) => new Date(y.at).getTime() - new Date(x.at).getTime());
};

const LeadTimeline: React.FC<{ customer: ImportedCustomer }> = ({ customer }) => {
  const items = buildItems(customer);

  return (
    <div>
      <h4 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100 mb-3">Timeline</h4>
      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">No activity history yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/70 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50/90 dark:hover:bg-gray-900/80 transition-all shadow-2xs"
            >
              <span className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-lg border shadow-xs ${item.iconClass}`}>
                {item.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-gray-900 dark:text-gray-100 leading-snug">{item.title}</div>
                {item.body}
                <time className="block mt-1 text-[11px] text-gray-400">{formatDateTime(item.at)}</time>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadTimeline;
