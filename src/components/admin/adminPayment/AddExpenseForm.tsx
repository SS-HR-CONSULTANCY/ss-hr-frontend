import React, { useState } from "react";
import { X, TrendingDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPayment } from "@/utils/apis/adminPaymentApi";
import { EXPENSE_CATEGORIES } from "@/utils/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddExpenseFormProps {
  onClose: () => void;
}

const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    expenseTitle: "",
    category: "",
    date: "",
    amount: "",
    remark: "",
  });

  const mutation = useMutation({
    mutationFn: () =>
      createPayment({
        customerId: "",
        packageId: "",
        customerName: form.expenseTitle,
        packageName: form.category || "Expense",
        totalAmount: parseFloat(form.amount) || 0,
        paidAmount: parseFloat(form.amount) || 0,
        balanceAmount: 0,
        paymentMethod: "cash",
        paymentDate: form.date,
        paymentStatus: "fullyPaid",
        referenceId: "",
        adminNotes: form.remark,
        paymentProof: "",
        invoiceUrl: "",
      }),
    onSuccess: () => {
      toast.success("Expense booked successfully");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      onClose();
    },
    onError: () => toast.error("Failed to book expense"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.expenseTitle || !form.category || !form.amount || !form.date) {
      toast.error("Title, Category, Date and Amount are required");
      return;
    }
    mutation.mutate();
  };

  const handleCategoryChange = (val: string) => {
    setForm((prev) => ({ ...prev, category: val }));
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-background text-foreground border rounded-2xl shadow-2xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-red-100 dark:bg-red-900/40 rounded-lg">
              <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-base font-semibold">Book Expense</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors rounded-lg p-1 hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-3">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Expense Title <span className="text-red-500">*</span></Label>
            <Input className="h-8 text-sm" placeholder="e.g. Office supplies" value={form.expenseTitle} onChange={set("expenseTitle")} />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Expense Category <span className="text-red-500">*</span></Label>
            <Select value={form.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="h-8 text-sm w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Date <span className="text-red-500">*</span></Label>
              <Input className="h-8 text-sm" type="date" value={form.date} onChange={set("date")} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Amount <span className="text-red-500">*</span></Label>
              <Input className="h-8 text-sm" type="number" placeholder="0.00" min="0" value={form.amount} onChange={set("amount")} />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Remark</Label>
            <Textarea className="text-sm resize-none" placeholder="Optional note..." rows={2} value={form.remark} onChange={set("remark")} />
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="button" variant="outline" className="flex-1 h-8 text-sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={mutation.isPending} className="flex-1 h-8 text-sm bg-red-600 hover:bg-red-700 text-white">
              {mutation.isPending ? "Saving..." : "Book Expense"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseForm;
