import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminFetchAllExpenses, type ExpenseItem } from "@/utils/apis/adminExpenseApi";
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
import { format, addMonths } from "date-fns";
import { DollarSign, Wallet, Calendar, PieChart as PieIcon } from "lucide-react";

type FilterMode = "monthly" | "category";

const STATUS_COLORS: Record<string, string> = {
  pending: "#ef4444",
  partially_paid: "#3b82f6",
  paid: "#10b981",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  partially_paid: "Partially Paid",
  paid: "Paid",
};

const CATEGORY_COLORS = [
  "#00838f",
  "#8b5cf6",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#10b981",
  "#6366f1",
  "#f43f5e",
];

const ExpensesOverview: React.FC = () => {
  const [filterMode, setFilterMode] = useState<FilterMode>("monthly");

  const { data, isLoading } = useQuery({
    queryKey: ["adminExpensesOverview"],
    queryFn: () => adminFetchAllExpenses(),
    staleTime: 2 * 60 * 1000,
  });

  const expenses: ExpenseItem[] = useMemo(() => data?.data ?? [], [data]);

  const summary = useMemo(() => {
    const totalCost = expenses.reduce((s, e) => s + (e.amount || 0), 0);
    const totalPaid = expenses.reduce((s, e) => s + (e.paidAmount || 0), 0);
    const totalBalance = expenses.reduce((s, e) => s + (e.balanceAmount || 0), 0);
    return { totalCost, totalPaid, totalBalance, count: expenses.length };
  }, [expenses]);

  // Status breakdown
  const statusData = useMemo(() => {
    const counts: Record<string, number> = { pending: 0, partially_paid: 0, paid: 0 };
    expenses.forEach((e) => {
      const st = e.status || "pending";
      if (counts[st] !== undefined) counts[st]++;
    });
    return Object.entries(counts).map(([st, count]) => ({
      name: STATUS_LABELS[st] || st,
      count,
      color: STATUS_COLORS[st] || "#94a3b8",
    }));
  }, [expenses]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      const cat = e.category || "General";
      if (!map[cat]) map[cat] = 0;
      map[cat] += e.amount || 0;
    });

    return Object.entries(map).map(([cat, cost], idx) => ({
      name: cat,
      "Expense Amount": cost,
      color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
    }));
  }, [expenses]);

  // Monthly breakdown
  const monthlyData = useMemo(() => {
    const months: { label: string; key: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = addMonths(new Date(), -i);
      months.push({ label: format(d, "MMM yyyy"), key: format(d, "yyyy-MM") });
    }

    return months.map(({ label, key }) => {
      const mExpenses = expenses.filter((e) => {
        const ed = e.createdAt ? format(new Date(e.createdAt), "yyyy-MM") : "";
        return ed === key;
      });
      const cost = mExpenses.reduce((s, e) => s + (e.amount || 0), 0);
      return { name: label, "Expense Amount": cost };
    });
  }, [expenses]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-xs">
        Loading expenses overview...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total Costs</p>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-1">
              AED {summary.totalCost.toLocaleString()}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{summary.count} cost entries</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-[#00838f] flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total Paid Out</p>
            <h3 className="text-xl font-bold text-green-600 mt-1">
              AED {summary.totalPaid.toLocaleString()}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Paid to vendors/costs</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-950/40 text-green-600 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border rounded-xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Pending Due</p>
            <h3 className="text-xl font-bold text-red-500 mt-1">
              AED {summary.totalBalance.toLocaleString()}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Outstanding balance</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-500 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Main Chart (3/5) */}
        <div className="lg:col-span-3 rounded-xl border bg-white dark:bg-slate-900 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-[#00838f]" />
              Expense Analysis ({filterMode === "monthly" ? "Last 6 Months" : "By Category"})
            </h3>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              {(["monthly", "category"] as FilterMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-all ${
                    filterMode === mode
                      ? "bg-white dark:bg-slate-700 text-[#00838f] shadow-sm font-semibold"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={filterMode === "monthly" ? monthlyData : categoryData}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value: number) => [`AED ${value.toLocaleString()}`, "Expense Amount"]} />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} iconType="square" iconSize={10} />
              <Bar dataKey="Expense Amount" fill="#00838f" radius={[4, 4, 0, 0]} maxBarSize={42} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status breakdown (2/5) */}
        <div className="lg:col-span-2 rounded-xl border bg-white dark:bg-slate-900 shadow-sm p-5 flex flex-col justify-between">
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-4">
            Expense Status Distribution
          </h3>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusData} layout="vertical" barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={100} />
              <Tooltip formatter={(val: number) => [val, "Entries"]} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={26}>
                {statusData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="flex flex-wrap gap-3 mt-4 pt-2 border-t">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: s.color }} />
                {s.name}: <span className="font-semibold text-slate-800 dark:text-slate-100">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesOverview;
