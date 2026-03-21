import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { X, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminfetchAllPaymentsResponse } from "@/utils/apis/adminPaymentApi";

// ─── Constants ────────────────────────────────────────────────────────────────
const CLIENT = {
  name: "SS HR Consultancy & Tours and Travels",
  address: [
    "Al Qiyadah Metro Station Exit 2",
    "Abu Saif Business Center",
    "Al Kazim Building, Entrance B",
    "Dubai, UAE",
  ],
  email: "hello@sshrconsultancy.com",
  phone: "+971 52 366 4492",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  n.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fmtDate = (s: string | null | undefined): string => {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const calcDueDate = (s: string | null | undefined): string => {
  if (!s) return "—";
  const d = new Date(s);
  if (isNaN(d.getTime())) return "—";
  d.setDate(d.getDate() + 15);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

// ─── Parse structured adminNotes ──────────────────────────────────────────────
interface InvoiceMeta {
  billToAddress?: string;
  description?: string;
  dueDate?: string;
}

const parseMeta = (raw: string): InvoiceMeta => {
  try {
    return JSON.parse(raw) as InvoiceMeta;
  } catch {
    // legacy plain-text — treat as address
    return { billToAddress: raw };
  }
};

// ─── Invoice Template ─────────────────────────────────────────────────────────
interface InvoiceTemplateProps {
  payment: AdminfetchAllPaymentsResponse;
  innerRef: React.RefObject<HTMLDivElement>;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ payment, innerRef }) => {
  const amount = payment.totalAmount || payment.paidAmount || 0;
  const invoiceNo = payment.referenceId || `INV-${payment._id.slice(-4).toUpperCase()}`;
  const invoiceDateStr = payment.paymentDate || payment.createdAt;
  const meta = parseMeta(payment.adminNotes || "{}");

  // Due date: from form if provided, else invoice date +15 days
  const resolvedDueDate = meta.dueDate
    ? fmtDate(meta.dueDate)
    : calcDueDate(invoiceDateStr);

  const description = meta.description || "Service";
  const billToAddress = meta.billToAddress || "";

  return (
    <div
      ref={innerRef}
      style={{
        width: "100%",
        maxWidth: "794px",
        background: "#ffffff",
        color: "#1a1a2e",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        fontSize: "14px",
        padding: "54px 64px",
        boxSizing: "border-box",
        margin: "0 auto",
      }}
    >
      {/* Print styles specifically for browser PDF generation */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0mm;
          }
          html, body {
            width: 794px !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* ── Row 1: INVOICE title (left) + Company name (right) ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
        <div style={{ fontSize: "52px", fontWeight: 800, letterSpacing: "-2px", color: "#1a1a2e", lineHeight: 1 }}>
          INVOICE
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700, fontSize: "15px", color: "#1a1a2e" }}>
            {CLIENT.name}
          </div>
        </div>
      </div>

      {/* ── Row 2: Invoice No | Invoice Date | Due Date ── */}
      <div style={{ borderTop: "1px solid #ccc", borderBottom: "1px solid #ccc", padding: "14px 0", marginBottom: "32px" }}>
        <div style={{ display: "flex" }}>
          {[
            { label: "Invoice No",   value: invoiceNo },
            { label: "Invoice Date", value: fmtDate(invoiceDateStr) },
            { label: "Due Date",     value: resolvedDueDate },
          ].map(({ label, value }, i) => (
            <div
              key={label}
              style={{
                flex: 1,
                textAlign: "center",
                borderRight: i < 2 ? "1px solid #e8e8e8" : "none",
              }}
            >
              <div style={{ fontSize: "11px", color: "#999", marginBottom: "5px", letterSpacing: "0.3px" }}>{label}</div>
              <div style={{ fontWeight: 600, fontSize: "14px", color: "#1a1a2e" }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Row 3: Client (left) | Bill To (right) ── */}
      <div style={{ display: "flex", gap: "48px", marginBottom: "40px" }}>
        {/* Left – permanent SS HR client */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "11px", color: "#999", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.6px" }}>
            Client
          </div>
          <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "6px", color: "#1a1a2e" }}>
            {CLIENT.name}
          </div>
          {CLIENT.address.map((l, i) => (
            <div key={i} style={{ fontSize: "13px", color: "#444", lineHeight: "1.75" }}>{l}</div>
          ))}
        </div>

        {/* Right – Bill To customer */}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "11px", color: "#999", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.6px" }}>
            Bill To
          </div>
          <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "6px", color: "#1a1a2e" }}>
            {payment.customerName}
          </div>
          {billToAddress && (
            <div style={{ fontSize: "13px", color: "#444", lineHeight: "1.75", whiteSpace: "pre-line" }}>
              {billToAddress}
            </div>
          )}
        </div>
      </div>

      {/* ── Row 4: Line items table ── */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#3b5998", color: "#fff" }}>
            {["Description", "Price", "Qty", "Amount"].map((h, i) => (
              <th
                key={h}
                style={{
                  padding: "12px 16px",
                  textAlign: i === 0 ? "left" : "right",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: "16px 16px", borderBottom: "1px solid #eee" }}>{description}</td>
            <td style={{ padding: "16px 16px", textAlign: "right", borderBottom: "1px solid #eee" }}>{fmt(amount)}</td>
            <td style={{ padding: "16px 16px", textAlign: "right", borderBottom: "1px solid #eee" }}>1</td>
            <td style={{ padding: "16px 16px", textAlign: "right", borderBottom: "1px solid #eee" }}>{fmt(amount)}</td>
          </tr>
        </tbody>
      </table>

      {/* ── Row 5: Totals ── */}
      <div style={{ borderTop: "2px solid #3b5998", paddingTop: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: 700 }}>
          <span>Total</span>
          <span>{fmt(amount)}</span>
        </div>
        {payment.paidAmount > 0 && payment.paidAmount < amount && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "13px", color: "#555" }}>
              <span>Paid</span>
              <span>{fmt(payment.paidAmount)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "14px", fontWeight: 700, color: "#c0392b" }}>
              <span>Balance Due</span>
              <span>{fmt(payment.balanceAmount)}</span>
            </div>
          </>
        )}
      </div>

      {/* ── Footer ── */}
      <div style={{ marginTop: "80px", borderTop: "1px solid #eee", paddingTop: "18px", textAlign: "center", fontSize: "11px", color: "#bbb" }}>
        {CLIENT.name} · {CLIENT.email} · {CLIENT.phone}
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
interface InvoicePDFViewerProps {
  payment: AdminfetchAllPaymentsResponse;
  onClose: () => void;
}

const InvoicePDFViewer: React.FC<InvoicePDFViewerProps> = ({ payment, onClose }) => {
  const templateRef = useRef<HTMLDivElement>(null!);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownload = useReactToPrint({
    contentRef: templateRef,
    documentTitle: `Invoice-${payment.referenceId || payment._id.slice(-6)}`,
    onBeforePrint: () => {
      setDownloading(true);
      return Promise.resolve();
    },
    onAfterPrint: () => setDownloading(false),
    onPrintError: (err: unknown) => {
      setDownloading(false);
      setDownloadError(err instanceof Error ? err.message : String(err));
    }
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col w-full max-w-4xl max-h-[95vh]">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">Invoice Preview</h2>
            {downloadError && (
               <span className="text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-md">
                 Error: {downloadError}
               </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDownload}
              disabled={downloading}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {downloading ? "Generating..." : "Download PDF"}
            </Button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable preview */}
        <div className="overflow-auto flex-1 bg-gray-100 dark:bg-gray-800 p-6 flex justify-center">
          <div style={{ transform: "scale(0.85)", transformOrigin: "top center" }}>
            <div className="shadow-xl">
              <InvoiceTemplate payment={payment} innerRef={templateRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePDFViewer;
