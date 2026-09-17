/** Centralised config for enquiry status colours and labels.
 *  Used by table-column status selects and enquiry detail modals.
 */

export type EnquiryStatusKey =
  | "pending"
  | "contacted"
  | "need_follow_up"
  | "not_interested"
  | "processing_application"
  | "completed"
  | "rejected_application";

interface StatusConfig {
  label: string;
  /** Tailwind classes applied to the SelectTrigger / badge */
  triggerClass: string;
  /** Tailwind classes applied to the dot indicator inside the trigger */
  dotClass: string;
}

export const ENQUIRY_STATUS_CONFIG: Record<EnquiryStatusKey, StatusConfig> = {
  pending: {
    label: "Pending",
    triggerClass:
      "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-600",
    dotClass: "bg-amber-400",
  },
  contacted: {
    label: "Contacted",
    triggerClass:
      "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-600",
    dotClass: "bg-blue-400",
  },
  need_follow_up: {
    label: "Need Follow Up",
    triggerClass:
      "border-orange-400 bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-600",
    dotClass: "bg-orange-400",
  },
  not_interested: {
    label: "Not Interested",
    triggerClass:
      "border-slate-400 bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300 dark:border-slate-500",
    dotClass: "bg-slate-400",
  },
  processing_application: {
    label: "Processing Application",
    triggerClass:
      "border-violet-400 bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-600",
    dotClass: "bg-violet-400",
  },
  completed: {
    label: "Completed",
    triggerClass:
      "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-600",
    dotClass: "bg-emerald-400",
  },
  rejected_application: {
    label: "Rejected Application",
    triggerClass:
      "border-red-400 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600",
    dotClass: "bg-red-400",
  },
};

export const DEFAULT_STATUS_CONFIG: StatusConfig = {
  label: "Pending",
  triggerClass:
    "border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  dotClass: "bg-amber-400",
};

export function getStatusConfig(status?: string): StatusConfig {
  if (!status) return DEFAULT_STATUS_CONFIG;
  return (
    ENQUIRY_STATUS_CONFIG[status as EnquiryStatusKey] ?? DEFAULT_STATUS_CONFIG
  );
}
