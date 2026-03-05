import React, { useState, useMemo } from "react";
import { X, Receipt, FileText, CheckCircle2, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPayment, getAllPayments } from "@/utils/apis/adminPaymentApi";
import type { AdminfetchAllPaymentsResponse } from "@/utils/apis/adminPaymentApi";

interface AddReceiptFormProps {
  onClose: () => void;
}

const AddReceiptForm: React.FC<AddReceiptFormProps> = ({ onClose }) => {
  const queryClient = useQueryClient();
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<AdminfetchAllPaymentsResponse | null>(null);
  const [form, setForm] = useState({
    date: "",
    amount: "",
    remark: "",
  });

  // Fetch all payments
  const { data: paymentsData, isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: () => getAllPayments(),
    staleTime: 30 * 1000,
  });

  // All active invoices
  const allActiveInvoices = useMemo(
    () =>
      (paymentsData?.data ?? []).filter(
        (p) => p.packageName === "Invoice" && p.paymentStatus !== "fullyPaid",
      ),
    [paymentsData],
  );

  // Unique customer names from active invoices
  const customerNames = useMemo(
    () => [...new Set(allActiveInvoices.map((inv) => inv.customerName))].sort(),
    [allActiveInvoices],
  );

  // Invoices filtered by selected customer
  const customerInvoices = useMemo(
    () => allActiveInvoices.filter((inv) => inv.customerName === selectedCustomer),
    [allActiveInvoices, selectedCustomer],
  );

  const handleSelectCustomer = (name: string) => {
    setSelectedCustomer(name);
    setSelectedInvoice(null);
    setForm((prev) => ({ ...prev, amount: "" }));
    setCustomerDropdownOpen(false);
  };

  const handleSelectInvoice = (invoice: AdminfetchAllPaymentsResponse) => {
    if (selectedInvoice?._id === invoice._id) {
      setSelectedInvoice(null);
      setForm((prev) => ({ ...prev, amount: "" }));
    } else {
      setSelectedInvoice(invoice);
      setForm((prev) => ({
        ...prev,
        amount: String(invoice.balanceAmount || invoice.totalAmount),
      }));
    }
  };

  const mutation = useMutation({
    mutationFn: () =>
      createPayment({
        customerId: "",
        packageId: "",
        customerName: selectedCustomer,
        packageName: "Receipt",
        totalAmount: parseFloat(form.amount) || 0,
        paidAmount: parseFloat(form.amount) || 0,
        balanceAmount: 0,
        paymentMethod: "banktransfer",
        paymentDate: form.date,
        paymentStatus: "fullyPaid",
        referenceId: selectedInvoice?.referenceId ?? "",
        adminNotes: selectedInvoice
          ? `Set off: ${selectedInvoice.referenceId || selectedInvoice._id}${form.remark ? ` | ${form.remark}` : ""}`
          : form.remark,
        paymentProof: "",
        invoiceUrl: "",
      }),
    onSuccess: () => {
      toast.success("Receipt saved successfully");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      onClose();
    },
    onError: () => toast.error("Failed to save receipt"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !form.amount || !form.date) {
      toast.error("Customer, Date and Amount are required");
      return;
    }
    mutation.mutate();
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const getStatusBadge = (status: string) => {
    if (status === "pending") return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400";
    if (status === "partiallyPaid") return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400";
    return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  };

  const getStatusLabel = (status: string) => {
    if (status === "pending") return "Pending";
    if (status === "partiallyPaid") return "Partial";
    return status;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-background text-foreground border rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-green-100 dark:bg-green-900/40 rounded-lg">
              <Receipt className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-base font-semibold">Add Receipt</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors rounded-lg p-1 hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

          {/* Step 1: Select Customer */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              1 · Select Customer <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setCustomerDropdownOpen((o) => !o)}
                className={`w-full h-9 flex items-center justify-between px-3 text-sm border rounded-lg bg-background hover:bg-muted/40 transition-colors ${
                  selectedCustomer ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {selectedCustomer || (isLoading ? "Loading customers..." : "Select a customer")}
                <ChevronDown className={`h-4 w-4 transition-transform ${customerDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {customerDropdownOpen && customerNames.length > 0 && (
                <div className="absolute z-10 top-full mt-1 w-full bg-background border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {customerNames.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleSelectCustomer(name)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-muted/50 transition-colors ${
                        selectedCustomer === name ? "text-green-600 font-medium bg-green-50 dark:bg-green-900/20" : ""
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
              {customerDropdownOpen && customerNames.length === 0 && !isLoading && (
                <div className="absolute z-10 top-full mt-1 w-full bg-background border rounded-lg shadow-lg px-3 py-2 text-xs text-muted-foreground">
                  No customers with active invoices
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Active Invoices for selected customer */}
          {selectedCustomer && (
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                2 · Select Invoice to Set Off
              </Label>
              {customerInvoices.length === 0 ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2.5">
                  <FileText className="h-4 w-4 shrink-0" />
                  No active invoices for {selectedCustomer}
                </div>
              ) : (
                <div className="space-y-1.5">
                  {customerInvoices.map((inv) => {
                    const isSelected = selectedInvoice?._id === inv._id;
                    return (
                      <button
                        key={inv._id}
                        type="button"
                        onClick={() => handleSelectInvoice(inv)}
                        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border text-left transition-all ${
                          isSelected
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                            : "border-border hover:border-muted-foreground/40 hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isSelected
                            ? <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                            : <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                          }
                          <div className="min-w-0">
                            {inv.referenceId
                              ? <p className="text-xs font-medium font-mono">{inv.referenceId}</p>
                              : <p className="text-xs text-muted-foreground italic">No ref</p>
                            }
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getStatusBadge(inv.paymentStatus)}`}>
                            {getStatusLabel(inv.paymentStatus)}
                          </span>
                          <span className="text-xs font-semibold">
                            ₹{(inv.balanceAmount || inv.totalAmount).toLocaleString()}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Divider */}
          {selectedCustomer && <div className="border-t border-dashed" />}

          {/* Step 3: Receipt Details */}
          <form id="receipt-form" onSubmit={handleSubmit} className="space-y-3">
            {selectedCustomer && (
              <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">
                3 · Receipt Details
              </Label>
            )}

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Date <span className="text-red-500">*</span></Label>
              <Input className="h-8 text-sm" type="date" value={form.date} onChange={set("date")} />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Amount <span className="text-red-500">*</span></Label>
              <Input
                className="h-8 text-sm"
                type="number"
                placeholder="0.00"
                min="0"
                value={form.amount}
                onChange={set("amount")}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Remark</Label>
              <Textarea className="text-sm resize-none" placeholder="Optional note..." rows={2} value={form.remark} onChange={set("remark")} />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 py-3 border-t shrink-0">
          <Button type="button" variant="outline" className="flex-1 h-8 text-sm" onClick={onClose}>Cancel</Button>
          <Button
            form="receipt-form"
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 h-8 text-sm bg-green-600 hover:bg-green-700 text-white"
          >
            {mutation.isPending ? "Saving..." : "Save Receipt"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddReceiptForm;
