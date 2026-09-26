import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminFetchAllBills } from "@/utils/apis/adminBillApi";
import type { AdminFetchAllBillsResponse } from "@/types/apiTypes/adminApiTypes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { format, startOfWeek, addDays, startOfMonth, addMonths } from "date-fns";
import { TrendingUp, Wallet, Clock, CheckCircle } from "lucide-react";

type FilterMode = "weekly" | "monthly";

/* ─── helpers ─────────────────────────────────────── */

const AED_TO_INR = 23;

/** Convert any amount to INR based on the bill's currency */
function toINR(amount: number, currency: string): number {
  return currency === "AED" ? amount * AED_TO_INR : amount;
}

function buildWeeklyData(bills: AdminFetchAllBillsResponse[]) {
  // Last 7 days, grouped by day
  const days: { label: string; date: Date }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(new Date(), -i);
    days.push({ label: format(d, "EEE dd"), date: d });
  }

  return days.map(({ label, date }) => {
    const dayStr = format(date, "yyyy-MM-dd");
    const dayBills = bills.filter((b) => {
      const bd = b.date ? format(new Date(b.date), "yyyy-MM-dd") : "";
      return bd === dayStr;
    });
    const invoice = dayBills.reduce((s, b) => s + toINR(b.invoiceAmount || 0, b.currency), 0);
    const received = dayBills.reduce(
      (s, b) => s + b.paymentHistory.reduce((ps, p) => ps + toINR(p.amount, b.currency), 0),
      0
    );
    const balance = dayBills.reduce((s, b) => s + toINR(b.balanceAmount || 0, b.currency), 0);
    return { name: label, Invoice: invoice, Received: received, Balance: balance };
  });
}

function buildMonthlyData(bills: AdminFetchAllBillsResponse[]) {
  // Last 6 months
  const months: { label: string; key: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = addMonths(new Date(), -i);
    months.push({ label: format(d, "MMM yyyy"), key: format(d, "yyyy-MM") });
  }

  return months.map(({ label, key }) => {
    const monthBills = bills.filter((b) => {
      const bd = b.date ? format(new Date(b.date), "yyyy-MM") : "";
      return bd === key;
    });
    const invoice = monthBills.reduce((s, b) => s + toINR(b.invoiceAmount || 0, b.currency), 0);
    const received = monthBills.reduce(
      (s, b) => s + b.paymentHistory.reduce((ps, p) => ps + toINR(p.amount, b.currency), 0),
      0
    );
    const balance = monthBills.reduce((s, b) => s + toINR(b.balanceAmount || 0, b.currency), 0);
    return { name: label, Invoice: invoice, Received: received, Balance: balance };
  });
}

/* ─── KPI Card ─────────────────────────────────────── */
interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: string;
}
const KpiCard: React.FC<KpiCardProps> = ({ icon, label, value, sub, color }) => (
  <div className={`rounded-xl border p-4 flex items-start gap-4 bg-card shadow-sm`}>
    <div className={`rounded-lg p-2.5 ${color}`}>{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
      <p className="text-xl font-bold text-foreground mt-0.5">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  </div>
);

/* ─── Status donut-style bar ──────────────────────── */
const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  partially_paid: "#8b5cf6",
  paid: "#10b981",
};
const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  partially_paid: "Partially Paid",
  paid: "Paid",
};

/* ─── Custom Tooltip ──────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-popover shadow-md px-3 py-2 text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-sm" style={{ background: p.fill }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-medium text-foreground">₹ {Math.round(p.value).toLocaleString("en-IN")}</span>
        </div>
      ))}
    </div>
  );
};

/* ─── Main Component ──────────────────────────────── */
const BillsOverview: React.FC = () => {
  const [filter, setFilter] = useState<FilterMode>("weekly");

  // Fetch ALL bills (high limit) for client-side aggregation
  const { data, isLoading } = useQuery({
    queryKey: ["adminBillsOverview"],
    queryFn: () => adminFetchAllBills({ pagination: { page: 1, limit: 10000 } } as any),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const bills: AdminFetchAllBillsResponse[] = useMemo(() => data?.data ?? [], [data]);

  // KPI totals
  const aedBills = bills.filter((b) => b.currency === "AED");
  const inrBills = bills.filter((b) => b.currency !== "AED");

  // AED total (raw, no conversion)
  const aedInvoice = aedBills.reduce((s, b) => s + (b.invoiceAmount || 0), 0);

  // INR total (raw, no conversion)
  const inrInvoice = inrBills.reduce((s, b) => s + (b.invoiceAmount || 0), 0);

  // Grand total in ₹ — AED×23 + INR
  const grandTotalINR = aedInvoice * AED_TO_INR + inrInvoice;

  // Still need these for the charts
  const totalInvoice = bills.reduce((s, b) => s + toINR(b.invoiceAmount || 0, b.currency), 0);
  const totalReceived = bills.reduce(
    (s, b) => s + b.paymentHistory.reduce((ps, p) => ps + toINR(p.amount, b.currency), 0),
    0
  );
  const totalBalance = bills.reduce((s, b) => {
    const inv = toINR(b.invoiceAmount || 0, b.currency);
    const paid = b.paymentHistory.reduce((ps, p) => ps + toINR(p.amount, b.currency), 0);
    return s + Math.max(0, inv - paid);
  }, 0);
  const aedReceived = aedBills.reduce(
    (s, b) => s + b.paymentHistory.reduce((ps, p) => ps + p.amount, 0),
    0
  );
  const aedBalance = aedBills.reduce((s, b) => {
    const paid = b.paymentHistory.reduce((ps, p) => ps + p.amount, 0);
    return s + Math.max(0, (b.invoiceAmount || 0) - paid);
  }, 0);

  // Status breakdown
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { pending: 0, partially_paid: 0, paid: 0 };
    bills.forEach((b) => { if (counts[b.status] !== undefined) counts[b.status]++; });
    return counts;
  }, [bills]);

  const statusData = Object.entries(statusCounts).map(([status, count]) => ({
    name: STATUS_LABELS[status] ?? status,
    count,
    color: STATUS_COLORS[status] ?? "#94a3b8",
  }));

  // Chart data
  const chartData = useMemo(
    () => (filter === "weekly" ? buildWeeklyData(bills) : buildMonthlyData(bills)),
    [bills, filter]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading overview...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards — single row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          icon={<TrendingUp className="w-5 h-5 text-violet-600" />}
          label="Billed Clients"
          value={bills.length.toString()}
          sub="Active in billing pipeline"
          color="bg-violet-50 dark:bg-violet-900/30"
        />

        {/* Split card: AED | INR */}
        <div className="rounded-xl border bg-card shadow-sm flex overflow-hidden">
          {/* AED half */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg p-2 bg-cyan-50 dark:bg-cyan-900/30">
                <Wallet className="w-4 h-4 text-cyan-600" />
              </div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Invoice AED</p>
            </div>
            <p className="text-xl font-bold text-foreground">AED {aedInvoice.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">{aedBills.length} AED client(s)</p>
          </div>

          {/* Divider */}
          <div className="w-px bg-border my-4" />

          {/* INR half */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg p-2 bg-emerald-50 dark:bg-emerald-900/30">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Invoice ₹</p>
            </div>
            <p className="text-xl font-bold text-foreground">₹ {inrInvoice.toLocaleString("en-IN")}</p>
            <p className="text-xs text-muted-foreground mt-1">{inrBills.length} INR client(s)</p>
          </div>
        </div>

        <KpiCard
          icon={<Clock className="w-5 h-5 text-amber-600" />}
          label="Total (₹)"
          value={`₹ ${Math.round(grandTotalINR).toLocaleString("en-IN")}`}
          sub={`AED×23 + ₹`}
          color="bg-amber-50 dark:bg-amber-900/30"
        />
      </div>

      {/* Charts row: Revenue Overview (left) + Payment Status Breakdown (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Bar Chart — takes 3/5 width */}
        <div className="lg:col-span-3 rounded-xl border bg-card shadow-sm p-5">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <h3 className="font-semibold text-foreground text-base">Revenue Overview</h3>
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {(["weekly", "monthly"] as FilterMode[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
                    filter === f
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} barCategoryGap="30%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.4 }} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
                iconType="square"
                iconSize={10}
              />
              <Bar dataKey="Invoice" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="Received" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="Balance" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status Breakdown — takes 2/5 width */}
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-sm p-5 flex flex-col justify-between">
          <h3 className="font-semibold text-foreground text-base mb-4">Payment Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusData} layout="vertical" barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={110}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                formatter={(value: number) => [value, "Clients"]}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend chips */}
          <div className="flex flex-wrap gap-3 mt-4">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ background: s.color }} />
                {s.name}: <span className="font-semibold text-foreground">{s.count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default BillsOverview;
