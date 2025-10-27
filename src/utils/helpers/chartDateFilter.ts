import { format, subDays } from "date-fns";
import type { TimeRange } from "@/types/componentTypes/chartTypes";

export function filterChartDataHelper<T extends { date: string }>(
  data: T[],
  timeRange: TimeRange,
): T[] {
  if (!Array.isArray(data)) return [];

  const today = new Date();
  const formattedToday = format(today, "yyyy-MM-dd");
  const referenceDate = new Date(formattedToday);

  let daysToSubtract = 7;
  if (timeRange === "14d") {
    daysToSubtract = 14;
  } else if (timeRange === "30d") {
    daysToSubtract = 30;
  } else if (timeRange === "45d") {
    daysToSubtract = 45;
  } else if (timeRange === "60d") {
    daysToSubtract = 60;
  } else if (timeRange === "90d") {
    daysToSubtract = 90;
  } else if (timeRange === "180d") {
    daysToSubtract = 180;
  } else if (timeRange === "365d") {
    daysToSubtract = 365;
  }

  const startDate = subDays(referenceDate, daysToSubtract);

  return data.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= startDate;
  });
}
