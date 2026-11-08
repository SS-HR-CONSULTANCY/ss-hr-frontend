import React, { useState, useEffect } from "react";
import {
  ExternalLink,
  Save,
  Loader2,
  FileText,
  Sparkles,
  Globe,
  Undo2,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  adminFormatAuditReport,
  type IFullStackContact,
  type IWebsiteAudit,
} from "@/utils/apis/adminFullStackContactApi";

interface Props {
  contact: IFullStackContact;
  onSaveAudit: (audit: IWebsiteAudit, newWebsite?: string) => Promise<void> | void;
  isSaving?: boolean;
}

const sanitizeAuditReport = (text: string): string => {
  return String(text || "")
    .replace(/^#*\s*Website Audit Report.*$/gim, "")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export const WebsiteAuditReportPanel: React.FC<Props> = ({
  contact,
  onSaveAudit,
  isSaving = false,
}) => {
  const existingAudit = contact.websiteAudit;
  const initialWebsite = contact.website || "";

  const [websiteUrl, setWebsiteUrl] = useState<string>(initialWebsite);
  const [report, setReport] = useState<string>(
    sanitizeAuditReport(existingAudit?.report || "")
  );
  const [isFormatting, setIsFormatting] = useState(false);
  const [undoData, setUndoData] = useState<{ report: string } | null>(null);

  useEffect(() => {
    if (contact.websiteAudit) {
      setReport(sanitizeAuditReport(contact.websiteAudit.report || ""));
    }
    if (contact.website) {
      setWebsiteUrl(contact.website);
    }
  }, [contact._id, contact.websiteAudit, contact.website]);

  const handleAIFormat = async () => {
    const trimmed = report.trim();
    if (!trimmed) {
      toast.info("Please paste or type your website notes/observations first");
      return;
    }

    try {
      setIsFormatting(true);
      const result = await adminFormatAuditReport({
        content: trimmed,
        website: websiteUrl.trim() || undefined,
        companyName: contact.companyName || contact.name,
      });

      if (result?.formattedReport) {
        const cleaned = sanitizeAuditReport(result.formattedReport);
        setUndoData({ report });
        setReport(cleaned);
        toast.success("Observations formatted with AI!");
      }
    } catch (err: any) {
      console.error("AI format failed:", err);
      toast.error(err?.response?.data?.message || "Failed to format with AI. Please check your OpenAI API key.");
    } finally {
      setIsFormatting(false);
    }
  };

  const handleUndo = () => {
    if (!undoData) return;
    setReport(undoData.report);
    setUndoData(null);
    toast.info("Reverted to previous notes");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedReport = sanitizeAuditReport(report);
    const payload: IWebsiteAudit = {
      report: cleanedReport,
    };
    await onSaveAudit(payload, websiteUrl.trim() || undefined);
  };

  const cleanHref = websiteUrl
    ? websiteUrl.startsWith("http")
      ? websiteUrl
      : `https://${websiteUrl}`
    : "";

  return (
    <form onSubmit={handleSave} className="space-y-5 text-xs text-gray-800 dark:text-gray-200">
      {/* ── Top Website Card ── */}
      <div className="p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 dark:from-indigo-950/30 dark:via-gray-900 dark:to-purple-950/20 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Globe className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="e.g. https://www.clientwebsite.com"
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
          />
          {cleanHref && (
            <a
              href={cleanHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shrink-0 shadow-xs"
              title="Open client website in a new tab"
            >
              <span>Visit Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {existingAudit?.auditedAt && (
          <div className="text-[11px] text-gray-400 sm:text-right shrink-0 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-gray-800 pt-2 sm:pt-0 sm:pl-3">
            <span className="block font-medium text-gray-600 dark:text-gray-300">
              Last Audited
            </span>
            <span>{new Date(existingAudit.auditedAt).toLocaleDateString()}</span>
            {existingAudit.auditedBy && (
              <span className="block text-gray-400">by {existingAudit.auditedBy}</span>
            )}
          </div>
        )}
      </div>

      {/* ── Detailed Analysis Report ── */}
      <div>
        <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Detailed Website Analysis & Client Pitch Notes
          </label>
          <div className="flex items-center gap-2">
            {undoData && (
              <button
                type="button"
                onClick={handleUndo}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white cursor-pointer px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Undo AI formatting"
              >
                <Undo2 className="w-3 h-3" />
                Undo AI
              </button>
            )}
            <button
              type="button"
              onClick={handleAIFormat}
              disabled={isFormatting}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-xs disabled:opacity-50 transition-all cursor-pointer"
              title="Use AI to structure and format copy-pasted notes into an audit report and sales pitch"
            >
              {isFormatting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Formatting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Format Report</span>
                </>
              )}
            </button>
          </div>
        </div>
        <textarea
          rows={12}
          value={report}
          onChange={(e) => setReport(e.target.value)}
          placeholder="Paste rough copy-pasted website notes, observed bugs, slow speed or mobile issues here, then click 'AI Format Report' above to automatically turn them into a professional client audit report..."
          className="w-full p-3 text-xs font-mono rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y leading-relaxed"
        />
      </div>

      {/* ── Save Button ── */}
      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? "Saving Report..." : "Save Website Audit Report"}</span>
        </button>
      </div>
    </form>
  );
};

export default WebsiteAuditReportPanel;
