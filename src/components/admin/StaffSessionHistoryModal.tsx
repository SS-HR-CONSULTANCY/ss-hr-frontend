import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, LogIn, LogOut, Monitor, RefreshCw } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HistorySession {
  loginAt: string | null;
  logoutAt: string | null;
  durationMs: number | null;
  status: "completed" | "active" | "no-logout";
  ipAddress?: string;
  userAgent?: string;
}

interface HistoryDay {
  date: string; // YYYY-MM-DD (IST)
  totalMs: number;
  sessions: HistorySession[];
}

interface SessionHistoryResponse {
  user: { _id: string; fullName: string; username: string; role: string };
  days: HistoryDay[];
  rangeDays: number;
}

interface StaffSessionHistoryModalProps {
  user: { _id: string; fullName: string; username: string } | null;
  onClose: () => void;
}

const RANGE_OPTIONS = [7, 30, 90];

const formatDuration = (ms?: number | null): string => {
  if (!ms || ms <= 0) return "—";
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (totalMin > 0) return `${m}m`;
  return `${Math.floor(ms / 1000)}s`;
};

const formatTime = (iso?: string | null): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
};

const formatDayLabel = (dateKey: string): string => {
  // dateKey is an IST calendar date; noon UTC keeps it on the same day in any timezone.
  const d = new Date(`${dateKey}T12:00:00Z`);
  const todayKey = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const yesterdayKey = new Date(Date.now() + 5.5 * 60 * 60 * 1000 - 86400000)
    .toISOString()
    .slice(0, 10);
  const label = d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  if (dateKey === todayKey) return `Today · ${label}`;
  if (dateKey === yesterdayKey) return `Yesterday · ${label}`;
  return label;
};

const parseDevice = (ua?: string): string => {
  if (!ua) return "—";
  const browser = ua.includes("Edg/")
    ? "Edge"
    : ua.includes("Chrome/")
      ? "Chrome"
      : ua.includes("Firefox/")
        ? "Firefox"
        : ua.includes("Safari/")
          ? "Safari"
          : "Browser";
  const os = ua.includes("Windows")
    ? "Windows"
    : ua.includes("Android")
      ? "Android"
      : ua.includes("iPhone") || ua.includes("iPad")
        ? "iOS"
        : ua.includes("Mac OS X")
          ? "macOS"
          : ua.includes("Linux")
            ? "Linux"
            : "";
  return os ? `${browser} · ${os}` : browser;
};

const StatusPill: React.FC<{ status: HistorySession["status"] }> = ({ status }) => {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Active
      </span>
    );
  }
  if (status === "no-logout") {
    return (
      <span
        className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800"
        title="Logged in again without logging out (browser closed or session expired)"
      >
        No logout
      </span>
    );
  }
  return null;
};

const StaffSessionHistoryModal: React.FC<StaffSessionHistoryModalProps> = ({ user, onClose }) => {
  const [rangeDays, setRangeDays] = useState(30);

  const { data, isLoading, isFetching, isError, refetch } = useQuery<SessionHistoryResponse>({
    queryKey: ["staffSessionHistory", user?._id, rangeDays],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/admin/system-users/${user!._id}/session-history?days=${rangeDays}`
      );
      return res.data.data;
    },
    enabled: Boolean(user?._id),
  });

  const days = data?.days || [];
  const rangeTotalMs = days.reduce((sum, d) => sum + d.totalMs, 0);
  const avgMs = days.length ? rangeTotalMs / days.length : 0;

  return (
    <Dialog open={Boolean(user)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-800">
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Login & Logout History
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
            {user?.fullName} <span className="text-gray-400">(@{user?.username})</span>
          </DialogDescription>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
            <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {RANGE_OPTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setRangeDays(d)}
                  className={`px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                    rangeDays === d
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  Last {d} days
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
              <span>
                Days active: <strong className="text-gray-900 dark:text-gray-100">{days.length}</strong>
              </span>
              <span>
                Total: <strong className="text-gray-900 dark:text-gray-100">{formatDuration(rangeTotalMs)}</strong>
              </span>
              <span>
                Avg/day: <strong className="text-gray-900 dark:text-gray-100">{formatDuration(avgMs)}</strong>
              </span>
              <button
                type="button"
                onClick={() => refetch()}
                className="text-gray-500 hover:text-blue-600 cursor-pointer"
                title="Refresh"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-blue-600" : ""}`} />
              </button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50/60 dark:bg-gray-950/40">
          {isLoading ? (
            <p className="text-center text-sm text-gray-500 py-10">Loading history...</p>
          ) : isError ? (
            <p className="text-center text-sm text-red-600 py-10">Failed to load history.</p>
          ) : days.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-10">
              No logins in the last {rangeDays} days.
            </p>
          ) : (
            days.map((day) => (
              <div
                key={day.date}
                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800">
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
                    <CalendarDays className="w-4 h-4 text-blue-600" />
                    {formatDayLabel(day.date)}
                  </span>
                  <span className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                    <span>
                      {day.sessions.length} session{day.sessions.length === 1 ? "" : "s"}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                      <Clock className="w-3 h-3" />
                      {formatDuration(day.totalMs)}
                    </span>
                  </span>
                </div>

                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-wider text-gray-500">
                      <th className="px-4 py-2 font-semibold">Login</th>
                      <th className="px-4 py-2 font-semibold">Logout</th>
                      <th className="px-4 py-2 font-semibold">Duration</th>
                      <th className="px-4 py-2 font-semibold">Device</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {day.sessions.map((sess, i) => (
                      <tr key={i} className="text-gray-700 dark:text-gray-300">
                        <td className="px-4 py-2">
                          <span className="inline-flex items-center gap-1.5">
                            <LogIn className="w-3 h-3 text-emerald-600" />
                            {formatTime(sess.loginAt)}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {sess.status === "completed" ? (
                            <span className="inline-flex items-center gap-1.5">
                              <LogOut className="w-3 h-3 text-rose-600" />
                              {formatTime(sess.logoutAt)}
                            </span>
                          ) : (
                            <StatusPill status={sess.status} />
                          )}
                        </td>
                        <td className="px-4 py-2 font-semibold tabular-nums">
                          {formatDuration(sess.durationMs)}
                        </td>
                        <td className="px-4 py-2 text-gray-500" title={sess.ipAddress || ""}>
                          <span className="inline-flex items-center gap-1.5">
                            <Monitor className="w-3 h-3" />
                            {parseDevice(sess.userAgent)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StaffSessionHistoryModal;
