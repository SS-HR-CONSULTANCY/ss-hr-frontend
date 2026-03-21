import React, { useState } from "react";
import { X, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPayment } from "@/utils/apis/adminPaymentApi";

interface AddInvoiceFormProps {
  onClose: () => void;
}

const AddInvoiceForm: React.FC<AddInvoiceFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    // Bill To
    billToName: "",
    billToAddress: "",
    // Line item
    description: "",
    amount: "",
  });

  const set =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const mutation = useMutation({
    mutationFn: () => {
      // Pack all printable invoice data as JSON into adminNotes
      const invoiceMeta = JSON.stringify({
        billToAddress: form.billToAddress,
        description: form.description,
        dueDate: form.dueDate,
      });

      return createPayment({
        customerId: "",
        packageId: "",
        customerName: form.billToName,
        packageName: "Invoice",
        totalAmount: parseFloat(form.amount) || 0,
        paidAmount: 0,
        balanceAmount: parseFloat(form.amount) || 0,
        paymentMethod: "banktransfer",
        paymentDate: form.invoiceDate,
        paymentStatus: "pending",
        referenceId: form.invoiceNumber,
        adminNotes: invoiceMeta,
        paymentProof: "",
        invoiceUrl: "",
      });
    },
    onSuccess: () => {
      toast.success("Invoice added successfully");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      onClose();
    },
    onError: () => toast.error("Failed to add invoice"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.billToName || !form.amount || !form.invoiceDate) {
      toast.error("Bill To Name, Invoice Date and Amount are required");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-background text-foreground border rounded-2xl shadow-2xl w-full max-w-lg max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-background z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
              <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-base font-semibold">Add Invoice</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors rounded-lg p-1 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">

          {/* ── Invoice Details ── */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Invoice Details
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Invoice No.</Label>
                <Input
                  className="h-8 text-sm"
                  placeholder="INV-001"
                  value={form.invoiceNumber}
                  onChange={set("invoiceNumber")}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Invoice Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="h-8 text-sm"
                  type="date"
                  value={form.invoiceDate}
                  onChange={set("invoiceDate")}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Due Date</Label>
                <Input
                  className="h-8 text-sm"
                  type="date"
                  value={form.dueDate}
                  onChange={set("dueDate")}
                />
              </div>
            </div>
          </div>

          {/* ── Bill To ── */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Bill To
            </p>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Client / Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="h-8 text-sm"
                  placeholder="Full Stack Solutions"
                  value={form.billToName}
                  onChange={set("billToName")}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Address</Label>
                <Textarea
                  className="text-sm resize-none"
                  placeholder={"Thrikkakkara PO\nKochi - 682021"}
                  rows={2}
                  value={form.billToAddress}
                  onChange={set("billToAddress")}
                />
              </div>
            </div>
          </div>

          {/* ── Line Item ── */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Line Item
            </p>
            <div className="space-y-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Description</Label>
                <Input
                  className="h-8 text-sm"
                  placeholder="Recruitment Service — Accountant Placement"
                  value={form.description}
                  onChange={set("description")}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Amount <span className="text-red-500">*</span>
                </Label>
                <Input
                  className="h-8 text-sm"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  value={form.amount}
                  onChange={set("amount")}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-9 text-sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 h-9 text-sm bg-orange-600 hover:bg-orange-700 text-white"
            >
              {mutation.isPending ? "Saving..." : "Save Invoice"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInvoiceForm;
