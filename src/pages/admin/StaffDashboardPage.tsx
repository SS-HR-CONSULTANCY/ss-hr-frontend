import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  ListTodo,
  Percent,
  PhoneCall,
  TriangleAlert,
  Users,
} from "lucide-react";
import type { RootState } from "@/store/store";
import { fetchStaffDashboard, type StaffDashboardData } from "@/utils/apis/adminStaffDashboardApi";

const FSS_COLOR = "#6366f1"; // indigo
const PLATFORM_COLOR = "#14b8a6"; // teal

const card =
  "bg-white dark:bg-gray-950 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800";

const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days < 7 ? `${days}d ago` : new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

const describeActivity = (a: StaffDashboardData["recentActivities"][number]): string => {
  switch (a.type) {
    case "status":
      return a.from ? `Status ${a.from} → ${a.to}` : `Status set to ${a.to}`;
    case "comment":
      return `Comment: ${a.to.length > 70 ? `${a.to.slice(0, 70)}...` : a.to}`;
    case "schedule":
      return `Follow-up ${a.from ? `${a.from} → ` : "set for "}${a.to}`;
    case "state":
      return `State ${a.from ? `${a.from} → ` : "set to "}${a.to}`;
    default:
      return a.to || a.type;
  }
};

interface KpiProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon: React.ReactNode;
  tone: string;
}

const Kpi: React.FC<KpiProps> = ({ label, value, hint, icon, tone }) => (
  <div className={`${card} p-4 flex items-start justify-between gap-3`}>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white tabular-nums">{value}</p>
      {hint && <p className="mt-0.5 text-[11px] text-gray-500 truncate">{hint}</p>}
    </div>
    <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${tone}`}>{icon}</div>
  </div>
);

const ChartCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => (
  <div className={`${card} p-4`}>
    <div className="mb-3">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
      {subtitle && <p className="text-[11px] text-gray-500">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const StaffDashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["staff-dashboard"],
    queryFn: () => fetchStaffDashboard(),
    refetchInterval: 60_000,
  });

  if (isLoading) {
    return <div className="pt-10 text-center text-sm text-gray-400">Loading your dashboard...</div>;
  }
  if (isError || !data) {
    return <div className="pt-10 text-center text-sm text-red-500">Could not load the dashboard. Please try again.</div>;
  }

  const { kpis } = data;
  const dutiesLabel = kpis.dutiesToday.total
    ? `${kpis.dutiesToday.completed}/${kpis.dutiesToday.total}`
    : "0";

  const dayLabel = (d: string) =>
    new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

  return (
    <div className="space-y-5 text-black dark:text-white pt-4 w-full pb-24">
      <div>
        <h1 className="text-xl font-bold">
          Welcome back, <span className="capitalize">{data.staff.fullName || user?.fullName || "there"}</span>
        </h1>
        <p className="text-xs text-gray-500">Your leads, follow-ups and activity at a glance.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi
          label="Assigned Leads"
          value={kpis.totalLeads}
          hint={`${kpis.pending} pending`}
          icon={<Users className="w-4 h-4" />}
          tone="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300"
        />
        <Kpi
          label="Follow-ups Today"
          value={kpis.followUpsToday}
          hint="Scheduled for today"
          icon={<CalendarClock className="w-4 h-4" />}
          tone="bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-300"
        />
        <Kpi
          label="Missed Follow-ups"
          value={kpis.missedFollowUps}
          hint={kpis.missedFollowUps ? "Needs attention" : "All caught up"}
          icon={<TriangleAlert className="w-4 h-4" />}
          tone="bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300"
        />
        <Kpi
          label="Converted"
          value={kpis.converted}
          hint={`${kpis.lost} lost`}
          icon={<CheckCircle2 className="w-4 h-4" />}
          tone="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"
        />
        <Kpi
          label="Conversion Rate"
          value={`${kpis.conversionRate}%`}
          hint="Converted / assigned"
          icon={<Percent className="w-4 h-4" />}
          tone="bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-300"
        />
        <Kpi
          label="Actions Today"
          value={kpis.actionsToday}
          hint="Updates, comments, schedules"
          icon={<PhoneCall className="w-4 h-4" />}
          tone="bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300"
        />
        <Kpi
          label="Duties Today"
          value={dutiesLabel}
          hint="Completed / assigned"
          icon={<ListTodo className="w-4 h-4" />}
          tone="bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-300"
        />
        <Kpi
          label="Pending Leads"
          value={kpis.pending}
          hint="Not contacted yet"
          icon={<ClipboardCheck className="w-4 h-4" />}
          tone="bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-300"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartCard title="My activity" subtitle="Actions you performed in the last 14 days">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.activityByDay} margin={{ top: 5, right: 12, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="date" tickFormatter={dayLabel} tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip labelFormatter={(l) => dayLabel(String(l))} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="fss" name="Full Stack Solutions" stroke={FSS_COLOR} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="platform" name="Contact List" stroke={PLATFORM_COLOR} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Leads by status" subtitle="Your assigned leads across both lists">
          {data.statusBreakdown.length === 0 ? (
            <p className="h-64 flex items-center justify-center text-xs text-gray-400">No leads assigned yet</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.statusBreakdown} margin={{ top: 5, right: 12, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="status" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={55} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="fss" name="Full Stack Solutions" stackId="a" fill={FSS_COLOR} />
                  <Bar dataKey="platform" name="Contact List" stackId="a" fill={PLATFORM_COLOR} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Follow-ups + recent activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className={`${card} p-4`}>
          <h3 className="text-sm font-semibold mb-3">Follow-ups due</h3>
          {data.followUps.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">Nothing due today. Nice work!</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {data.followUps.map((f, i) => (
                <li key={`${f.name}-${i}`} className="py-2 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{f.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">
                      {f.source} · {f.status}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                      f.overdue
                        ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900"
                        : "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-900"
                    }`}
                  >
                    {f.overdue ? `Overdue · ${dayLabel(f.scheduledDate)}` : "Today"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`${card} p-4`}>
          <h3 className="text-sm font-semibold mb-3">Recent activity</h3>
          {data.recentActivities.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">No activity yet</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-800">
              {data.recentActivities.map((a, i) => (
                <li key={`${a.at}-${i}`} className="py-2 flex items-start gap-2.5 text-xs">
                  <span
                    className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: a.source === "Contact List" ? PLATFORM_COLOR : FSS_COLOR }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{a.leadName}</p>
                    <p className="text-[11px] text-gray-500 truncate">{describeActivity(a)}</p>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 text-[11px] text-gray-400">
                    <Clock className="w-3 h-3" />
                    {timeAgo(a.at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardPage;
