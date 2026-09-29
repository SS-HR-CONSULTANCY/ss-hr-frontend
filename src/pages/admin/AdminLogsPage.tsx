import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminFetchLogs, type AdminLog } from "@/utils/apis/adminLogApi";
import { format, formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Shared helpers ──────────────────────────────────────────────────────────

// Date+time for log timestamps: "September 29 at 4:57 PM"
const fmtDateTime = (d: string | Date) => {
  try { return format(new Date(d), "MMMM d 'at' h:mm a"); } catch { return ""; }
};

// Date-only for payment/due dates: "September 26" (avoids "at 12:00 AM" from date pickers)
const fmtDateOnly = (d: string | Date) => {
  try { return format(new Date(d), "MMMM d, yyyy"); } catch { return ""; }
};

const fmtAmount = (amount: any, currency?: string) =>
  `${currency || "AED"} ${Number(amount).toLocaleString()}`;

// ─── Colour tokens ───────────────────────────────────────────────────────────

// Timeline dot
const DOT: Record<string, string> = {
  CREATE: "bg-emerald-500",
  UPDATE: "bg-blue-500",
  DELETE: "bg-red-500",
};

// Coloured inline spans
const Who   = ({ v }: { v: string }) => <span className="font-semibold text-slate-900 dark:text-slate-100">{v}</span>;
const Verb  = ({ v, action }: { v: string; action: string }) => {
  const cls = action === "CREATE" ? "text-emerald-600 font-medium"
            : action === "DELETE" ? "text-red-500 font-medium"
            : "text-blue-600 font-medium";
  return <span className={cls}>{v}</span>;
};
const Amt   = ({ v }: { v: string }) => <span className="font-semibold text-violet-600">{v}</span>;
const Ref   = ({ v }: { v: string }) => <span className="font-medium text-[#00838f]">{v}</span>;
const Date_ = ({ v }: { v: string }) => <span className="text-amber-600 font-medium">{v}</span>;
const Muted = ({ v }: { v: string }) => <span className="text-slate-500">{v}</span>;

// Renders "INV-001 — John Doe" as: orange invoice number · teal client name
const InvoiceRef = ({ entityName }: { entityName?: string }) => {
  if (!entityName) return <Ref v="the invoice" />;
  const parts = entityName.split(" — ");
  const inv  = parts[0]?.trim();
  const name = parts[1]?.trim();
  return (
    <>
      {inv && <span className="font-semibold text-orange-500">{inv}</span>}
      {inv && name && <span className="text-slate-400"> · </span>}
      {name && <span className="font-medium text-[#00838f]">{name}</span>}
    </>
  );
};

const Updated = ({ parts }: { parts: string[] }) =>
  parts.length ? (
    <><span className="text-slate-400"> — updated </span><span className="text-slate-600 dark:text-slate-300">{parts.join(" and ")}</span></>
  ) : null;

// ─── JSX sentence builder ────────────────────────────────────────────────────

const buildJsx = (log: AdminLog): React.ReactNode => {
  const who = log.performedBy || "Admin";
  const c   = log.changes || {};
  const entity = log.entityName;
  const on  = fmtDateTime(log.createdAt);

  switch (log.module) {

    // ── Bill Payment ─────────────────────────────────────────────────────
    case "BillPayment": {
      const amt = c.amount !== undefined ? fmtAmount(c.amount, c.currency) : null;

      if (log.action === "CREATE") return (
        <><Who v={who} /> <Verb v="recorded a payment of" action="CREATE" /> {amt && <><Amt v={amt} /> </>}
        <Muted v="for invoice " /><InvoiceRef entityName={log.entityName} /> <Muted v="on " /><Date_ v={on} />.</>
      );
      if (log.action === "UPDATE") {
        const parts: string[] = [];
        if (c.amount !== undefined) parts.push(`amount to ${fmtAmount(c.amount, c.currency)}`);
        if (c.date) parts.push(`payment date to ${fmtDateOnly(c.date)}`);
        return (
          <><Who v={who} /> <Verb v="revised the payment" action="UPDATE" /> <Muted v="on invoice " />
          <InvoiceRef entityName={log.entityName} /><Updated parts={parts} /> <Muted v="on " /><Date_ v={on} />.</>
        );
      }
      if (log.action === "DELETE") return (
        <><Who v={who} /> <Verb v="removed a payment entry" action="DELETE" /> <Muted v="from invoice " />
        <InvoiceRef entityName={log.entityName} /> <Muted v="on " /><Date_ v={on} />.</>
      );
      break;
    }

    // ── Bill ─────────────────────────────────────────────────────────────
    case "Bill": {
      const parts: string[] = [];
      if (c.invoiceAmount !== undefined) parts.push(`invoice amount to ${fmtAmount(c.invoiceAmount, c.currency)}`);
      if (c.status)        parts.push(`status to "${c.status}"`);
      if (c.serviceStatus) parts.push(`service status to "${c.serviceStatus}"`);
      if (c.dueDate)       parts.push(`due date to ${fmtDateOnly(c.dueDate)}`);
      return (
        <><Who v={who} /> <Verb v="updated billing details" action="UPDATE" /> <Muted v="for " />
        <InvoiceRef entityName={log.entityName} /><Updated parts={parts} /> <Muted v="on " /><Date_ v={on} />.</>
      );
    }

    // ── Expense Payment ──────────────────────────────────────────────────
    case "ExpensePayment": {
      const amt    = c.amount !== undefined ? fmtAmount(c.amount, c.currency) : null;
      const expRef = entity ? `"${entity}"` : "the expense";

      if (log.action === "CREATE") return (
        <><Who v={who} /> <Verb v="recorded a payment of" action="CREATE" /> {amt && <><Amt v={amt} /> </>}
        {c.paymentMethod && <><Muted v="via " /><span className="text-indigo-500 font-medium">{c.paymentMethod}</span> </>}
        <Muted v="against expense " /><Ref v={expRef} /> <Muted v="on " /><Date_ v={on} />.</>
      );
      if (log.action === "UPDATE") {
        const parts: string[] = [];
        if (c.amount !== undefined) parts.push(`amount to ${fmtAmount(c.amount, c.currency)}`);
        if (c.date) parts.push(`date to ${fmtDateOnly(c.date)}`);
        if (c.paymentMethod) parts.push(`method to ${c.paymentMethod}`);
        return (
          <><Who v={who} /> <Verb v="revised the payment" action="UPDATE" /> <Muted v="against expense " />
          <Ref v={expRef} /><Updated parts={parts} /> <Muted v="on " /><Date_ v={on} />.</>
        );
      }
      if (log.action === "DELETE") return (
        <><Who v={who} /> <Verb v="removed a payment entry" action="DELETE" /> <Muted v="against expense " />
        <Ref v={expRef} /> <Muted v="on " /><Date_ v={on} />.</>
      );
      break;
    }

    // ── Expense ──────────────────────────────────────────────────────────
    case "Expense": {
      const title  = c.title || entity;
      const expRef = title ? `"${title}"` : "an expense";

      if (log.action === "CREATE") return (
        <><Who v={who} /> <Verb v="created a new expense" action="CREATE" /> <Ref v={expRef} />
        {c.amount !== undefined && <> <Muted v="of " /><Amt v={fmtAmount(c.amount, c.currency)} /></>}
        {c.vendorName && <> <Muted v="for vendor " /><span className="text-pink-600 font-medium">"{c.vendorName}"</span></>}
        {" "}<Muted v="on " /><Date_ v={on} />.</>
      );
      if (log.action === "UPDATE") {
        const parts: string[] = [];
        if (c.amount !== undefined) parts.push(`amount to ${fmtAmount(c.amount, c.currency)}`);
        if (c.status) parts.push(`status to "${c.status}"`);
        if (c.dueDate) parts.push(`due date to ${fmtDateOnly(c.dueDate)}`);
        if (c.vendorName) parts.push(`vendor to "${c.vendorName}"`);
        return (
          <><Who v={who} /> <Verb v="updated expense" action="UPDATE" /> <Ref v={expRef} />
          <Updated parts={parts} /> <Muted v="on " /><Date_ v={on} />.</>
        );
      }
      if (log.action === "DELETE") return (
        <><Who v={who} /> <Verb v="deleted expense" action="DELETE" /> <Ref v={expRef} />
        {" "}<Muted v="on " /><Date_ v={on} />.</>
      );
      break;
    }

    // ── Default fallback ──────────────────────────────────────────────────
    default: {
      const verb     = log.action === "CREATE" ? "created" : log.action === "DELETE" ? "deleted" : "updated";
      const modLabel = log.module.replace(/([A-Z])/g, " $1").trim().toLowerCase();
      return (
        <><Who v={who} /> <Verb v={verb} action={log.action} /> <Muted v={`${modLabel}${entity ? ` "${entity}"` : ""} on `} /><Date_ v={on} />.</>
      );
    }
  }

  return <span className="text-slate-600">{log.description}</span>;
};

const LIMIT = 50;

// ─── Log Line ────────────────────────────────────────────────────────────────
const LogLine: React.FC<{ log: AdminLog; isLast: boolean }> = ({ log, isLast }) => {
  const dot = DOT[log.action] || "bg-slate-400";
  const timeAgo = log.createdAt
    ? formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })
    : "—";

  return (
    <div className="flex gap-3">
      {/* Timeline spine */}
      <div className="flex flex-col items-center">
        <div className={cn("w-2 h-2 rounded-full mt-[5px] shrink-0", dot)} />
        {!isLast && <div className="w-px flex-1 bg-slate-200 dark:bg-slate-700 mt-1" />}
      </div>

      {/* Rich coloured sentence */}
      <p className="pb-4 text-[13px] leading-relaxed flex-1 min-w-0 flex flex-wrap items-baseline gap-x-1">
        {buildJsx(log)}
        <span className="text-slate-400 dark:text-slate-500 text-[11px] ml-1 whitespace-nowrap">
          · {timeAgo}
        </span>
      </p>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const AdminLogsPage: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data: logsData, isLoading, refetch } = useQuery({
    queryKey: ["adminLogs", page],
    queryFn: () => adminFetchLogs({ page, limit: LIMIT }),
    staleTime: 30000,
  });

  const logs: AdminLog[] = logsData?.data || [];
  const totalPages = logsData?.totalPages || 1;
  const totalCount = logsData?.totalCount || 0;

  return (
    <div className="pb-4 w-full h-full overflow-y-auto">


      {/* Feed */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground py-12 text-center">Loading logs...</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-muted-foreground py-12 text-center">
          No logs yet. Activity will appear here when admin actions are performed.
        </p>
      ) : (
        <div className="px-1">
          {logs.map((log, idx) => (
            <LogLine key={log._id} log={log} isLast={idx === logs.length - 1} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border mt-2">
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-7 px-3 text-xs"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-7 px-3 text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogsPage;
