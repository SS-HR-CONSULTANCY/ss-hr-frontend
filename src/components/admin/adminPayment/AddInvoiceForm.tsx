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
    date: "",
    customerName: "",
    amount: "",
    remark: "",
  });

  const mutation = useMutation({
    mutationFn: () =>
      createPayment({
        customerId: "",
        packageId: "",
        customerName: form.customerName,
        packageName: "Invoice",
        totalAmount: parseFloat(form.amount) || 0,
        paidAmount: 0,
        balanceAmount: parseFloat(form.amount) || 0,
        paymentMethod: "banktransfer",
        paymentDate: form.date,
        paymentStatus: "pending",
        referenceId: form.invoiceNumber,
        adminNotes: form.remark,
        paymentProof: "",
        invoiceUrl: "",
      }),
    onSuccess: () => {
      toast.success("Invoice added successfully");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      onClose();
    },
    onError: () => toast.error("Failed to add invoice"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.amount || !form.date) {
      toast.error("Customer Name, Date and Amount are required");
      return;
    }
    mutation.mutate();
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-background text-foreground border rounded-2xl shadow-2xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
              <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-base font-semibold">Add Invoice</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors rounded-lg p-1 hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Invoice No.</Label>
              <Input className="h-8 text-sm" placeholder="INV-001" value={form.invoiceNumber} onChange={set("invoiceNumber")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Date <span className="text-red-500">*</span></Label>
              <Input className="h-8 text-sm" type="date" value={form.date} onChange={set("date")} />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Customer Name <span className="text-red-500">*</span></Label>
            <Input className="h-8 text-sm" placeholder="Enter customer name" value={form.customerName} onChange={set("customerName")} />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Amount <span className="text-red-500">*</span></Label>
            <Input className="h-8 text-sm" type="number" placeholder="0.00" min="0" value={form.amount} onChange={set("amount")} />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Remark</Label>
            <Textarea className="text-sm resize-none" placeholder="Optional note..." rows={2} value={form.remark} onChange={set("remark")} />
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" className="flex-1 h-8 text-sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} className="flex-1 h-8 text-sm bg-orange-600 hover:bg-orange-700 text-white">
              {mutation.isPending ? "Saving..." : "Save Invoice"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInvoiceForm;
