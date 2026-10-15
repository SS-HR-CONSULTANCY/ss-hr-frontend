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
