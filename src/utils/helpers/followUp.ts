export const NEED_FOLLOW_UP_STATUS = "Need Follow Up";

/** Today's date as YYYY-MM-DD (UTC, consistent with how scheduled dates are stored/compared). */
export const getTodayString = (): string => new Date().toISOString().split("T")[0];

/**
 * A lead is a "missed follow up" when it needs a follow up but its scheduled
 * date is in the past (strictly before today). Dates are YYYY-MM-DD strings.
 */
export const isMissedFollowUp = (status?: string, scheduledDate?: string): boolean => {
  if (status !== NEED_FOLLOW_UP_STATUS || !scheduledDate) return false;
  return scheduledDate.slice(0, 10) < getTodayString();
};

export const FOLLOW_UP_WARNING_MESSAGE =
  "Follow up date is in the past. Please add a future date, otherwise this follow up will be missed.";

export interface LeadWithStatusInfo {
  status?: string;
  isNewLead?: boolean;
  activityLog?: Array<{ type: string; from?: string; to?: string }>;
}

/**
 * Newly added platform leads show a 'New' label while status is Pending.
 * Once changed from Pending to any other status, the 'New' label is removed.
 */
export const isNewPlatformLead = (lead?: LeadWithStatusInfo | null): boolean => {
  if (!lead) return false;
  const status = lead.status || "Pending";
  if (status !== "Pending") return false;
  if (lead.isNewLead === false) return false;
  if (lead.activityLog && lead.activityLog.some(a => a.type === "status" && a.from === "Pending" && a.to !== "Pending")) {
    return false;
  }
  return true;
};
