import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Sparkles, Loader2, ClipboardPaste } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  adminParseFSSLeads,
  adminBulkCreateFSSContacts,
  type ParsedLead,
} from "@/utils/apis/adminFullStackContactApi";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Row extends ParsedLead {
  selected: boolean;
}

const inputCls =
  "w-full px-2 py-1 text-xs rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500";

const ImportLeadsModal: React.FC<Props> = ({ open, onOpenChange }) => {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const [rows, setRows] = useState<Row[]>([]);

  const close = () => {
    onOpenChange(false);
    setText("");
    setRows([]);
  };

  const parseMutation = useMutation({
    mutationFn: adminParseFSSLeads,
    onSuccess: (leads) => {
      if (!leads.length) {
        toast.warn("No leads found in the pasted text");
        return;
      }
      // Deduplicate repeated listings from scroll/pagination in pasted text
      const seenPhones = new Set<string>();
      let dupCount = 0;
      const uniqueLeads = leads.filter((l) => {
        const digits = (l.phone || "").replace(/\D/g, "");
        if (!digits) return true;
        if (seenPhones.has(digits)) {
          dupCount++;
          return false;
        }
        seenPhones.add(digits);
        return true;
      });

      if (dupCount > 0) {
        toast.info(`Filtered out ${dupCount} repeated listing${dupCount > 1 ? "s" : ""} from pasted text`);
      }
      setRows(uniqueLeads.map((l) => ({ ...l, selected: !!l.phone })));
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to parse leads"),
  });

  const importMutation = useMutation({
    mutationFn: adminBulkCreateFSSContacts,
    onSuccess: (r) => {
      queryClient.invalidateQueries({ queryKey: ["fss-contacts"] });
      toast.success(
        `${r.created} imported${r.duplicates ? `, ${r.duplicates} duplicate(s) skipped` : ""}${
          r.skippedNoPhone ? `, ${r.skippedNoPhone} without phone skipped` : ""
        }`
      );
      close();
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to import leads"),
  });

  const updateRow = (i: number, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const selected = rows.filter((r) => r.selected && r.phone.trim());

  const handleImport = () => {
    importMutation.mutate(
      selected.map((r) => ({
        name: r.name,
        phone: r.phone,
        website: r.website,
        projectDescription: [
          r.category && `Category: ${r.category}`,
          r.address && `Address: ${r.address}`,
          r.rating && `Rating: ${r.rating}${r.reviews ? ` (${r.reviews} reviews)` : ""}`,
        ]
          .filter(Boolean)
          .join(" | "),
      }))
    );
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Leads from Google Maps</DialogTitle>
          <DialogDescription>
            Paste copied Google Maps results. AI converts them into a table you can review before importing.
          </DialogDescription>
        </DialogHeader>

        {rows.length === 0 ? (
          <div className="space-y-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={12}
              placeholder="Paste Google Maps results here..."
              className={`${inputCls} p-3 font-mono`}
            />
            <DialogFooter>
              <button
                type="button"
                onClick={close}
                className="px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!text.trim() || parseMutation.isPending}
                onClick={() => parseMutation.mutate(text)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold"
              >
                {parseMutation.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                {parseMutation.isPending ? "Converting..." : "Convert to Table"}
              </button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900 text-[11px] uppercase text-gray-500">
                    <th className="px-2 py-2 w-8">
                      <input
                        type="checkbox"
                        checked={rows.filter((r) => r.phone.trim()).every((r) => r.selected)}
                        onChange={(e) =>
                          setRows((prev) =>
                            prev.map((r) => ({ ...r, selected: e.target.checked && !!r.phone.trim() }))
                          )
                        }
                      />
                    </th>
                    <th className="px-2 py-2">Name</th>
                    <th className="px-2 py-2">Phone</th>
                    <th className="px-2 py-2">Category</th>
                    <th className="px-2 py-2">Address</th>
                    <th className="px-2 py-2">Website</th>
                    <th className="px-2 py-2">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="px-2 py-1.5">
                        <input
                          type="checkbox"
                          checked={r.selected}
                          disabled={!r.phone.trim()}
                          onChange={(e) => updateRow(i, { selected: e.target.checked })}
                        />
                      </td>
                      <td className="px-2 py-1.5 min-w-[180px]">
                        <input className={inputCls} value={r.name} onChange={(e) => updateRow(i, { name: e.target.value })} />
                      </td>
                      <td className="px-2 py-1.5 min-w-[120px]">
                        <input
                          className={`${inputCls} ${!r.phone.trim() ? "border-red-300" : ""}`}
                          value={r.phone}
                          placeholder="No phone"
                          onChange={(e) =>
                            updateRow(i, { phone: e.target.value, selected: r.selected || !!e.target.value.trim() })
                          }
                        />
                      </td>
                      <td className="px-2 py-1.5 min-w-[140px]">
                        <input className={inputCls} value={r.category} onChange={(e) => updateRow(i, { category: e.target.value })} />
                      </td>
                      <td className="px-2 py-1.5 min-w-[200px]">
                        <input className={inputCls} value={r.address} onChange={(e) => updateRow(i, { address: e.target.value })} />
                      </td>
                      <td className="px-2 py-1.5 min-w-[140px]">
                        <input className={inputCls} value={r.website} onChange={(e) => updateRow(i, { website: e.target.value })} />
                      </td>
                      <td className="px-2 py-1.5 whitespace-nowrap text-gray-600 dark:text-gray-400">
                        {r.rating ? `${r.rating}${r.reviews ? ` (${r.reviews})` : ""}` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-gray-500">
              {selected.length} of {rows.length} selected. Rows without a phone number cannot be imported until one is
              added. Existing phone numbers are skipped automatically.
            </p>
            <DialogFooter>
              <button
                type="button"
                onClick={() => setRows([])}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-xs font-semibold"
              >
                <ClipboardPaste className="w-3.5 h-3.5" /> Paste again
              </button>
              <button
                type="button"
                disabled={!selected.length || importMutation.isPending}
                onClick={handleImport}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold"
              >
                {importMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Import {selected.length} Lead{selected.length === 1 ? "" : "s"}
              </button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImportLeadsModal;

