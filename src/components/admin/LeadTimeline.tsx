import React from "react";
import { UserPlus, RefreshCw, MessageSquare, CalendarClock, MapPin, UserCheck } from "lucide-react";
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
            <span className="font-medium">{a.to ? "Comment updated" : "Comment removed"}</span>
          ),
          body: a.to ? (
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-md px-2.5 py-1.5">
              {a.to}
            </p>
          ) : undefined,
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
      <ol className="relative ml-3.5 border-l-2 border-gray-200 dark:border-gray-800 space-y-5">
        {items.map((item) => (
          <li key={item.key} className="ml-6 relative">
            <span
              className={`absolute -left-[39px] top-0 flex items-center justify-center w-7 h-7 rounded-full border ring-4 ring-white dark:ring-gray-950 ${item.iconClass}`}
            >
              {item.icon}
            </span>
            <div className="text-sm text-gray-900 dark:text-gray-100">{item.title}</div>
            {item.body}
            <time className="block mt-0.5 text-xs text-gray-400">{formatDateTime(item.at)}</time>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default LeadTimeline;
