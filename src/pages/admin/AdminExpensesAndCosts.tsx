import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  adminFetchAllExpenses,
  adminCreateExpense,
  adminUpdateExpense,
  adminAddExpensePayment,
  adminDeleteExpense,
  adminFetchExpenseCategories,
  adminCreateExpenseCategory,
  type ExpenseItem,
} from "@/utils/apis/adminExpenseApi";
import { AdminExpenseTableColumns } from "@/components/table/tableColumns/AdminExpenseTableColumns";
import ExpensesOverview from "@/components/admin/expenses/ExpensesOverview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Wallet, DollarSign, Calendar, Search, List, BarChart2, Filter } from "lucide-react";
import { toast } from "react-toastify";

type Tab = "list" | "overview";

const AdminExpensesAndCosts: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("list");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Category addition state inside Add Modal
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState("");

  // Add Expense Form state
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newVendor, setNewVendor] = useState("");
  const [newDate, setNewDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [newRef, setNewRef] = useState("");
  const [newCurrency, setNewCurrency] = useState<"AED" | "INR">("AED");
  const [newAmount, setNewAmount] = useState("");
  const [newDueDate, setNewDueDate] = useState("");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "list", label: "Expense List", icon: <List className="w-4 h-4" /> },
    { id: "overview", label: "Overview", icon: <BarChart2 className="w-4 h-4" /> },
  ];

  // Fetch dedicated expense categories
  const { data: categoriesData } = useQuery({
    queryKey: ["adminExpenseCategories"],
    queryFn: adminFetchExpenseCategories,
  });
  const dbCategories: any[] = categoriesData?.data ?? [];
  const dbCategoryNames: string[] = Array.from(
    new Set(dbCategories.map((c: any) => c.name).filter(Boolean))
  );

  // Create Expense Category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => adminCreateExpenseCategory(name),
    onSuccess: (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["adminExpenseCategories"] });
        setNewCategory(res.data.name);
        setIsAddingNewCategory(false);
        setCustomCategoryName("");
        toast.success(`Expense Category "${res.data.name}" added`);
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create category");
    },
  });

  const handleAddCustomCategory = () => {
    if (!customCategoryName.trim()) return;
    createCategoryMutation.mutate(customCategoryName.trim());
  };

  const { data, isLoading } = useQuery({
    queryKey: ["adminExpenses", search, categoryFilter, statusFilter],
    queryFn: () =>
      adminFetchAllExpenses({
        search: search || undefined,
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
      }),
  });

  const expenses = data?.data || [];

  const createExpenseMutation = useMutation({
    mutationFn: adminCreateExpense,
    onSuccess: (res) => {
      if (res.success) {
        toast.success("Expense added successfully");
        queryClient.invalidateQueries({ queryKey: ["adminExpenses"] });
        setIsAddModalOpen(false);
        // Reset form
        setNewTitle("");
        setNewCategory("");
        setNewVendor("");
        setNewDate(format(new Date(), "yyyy-MM-dd"));
        setNewRef("");
        setNewAmount("");
        setNewDueDate("");
        setIsAddingNewCategory(false);
        setCustomCategoryName("");
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to add expense");
    },
  });

  const updateExpenseMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminUpdateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminExpenses"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update expense");
    },
  });

  const addPaymentMutation = useMutation({
    mutationFn: ({ id, payment }: { id: string; payment: any }) => adminAddExpensePayment(id, payment),
    onSuccess: () => {
      toast.success("Payment recorded successfully");
      queryClient.invalidateQueries({ queryKey: ["adminExpenses"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to record payment");
    },
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: adminDeleteExpense,
    onSuccess: () => {
      toast.success("Expense deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["adminExpenses"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete expense");
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount) {
      toast.error("Please provide title and amount");
      return;
    }
    createExpenseMutation.mutate({
      title: newTitle.trim(),
      category: newCategory.trim(),
      vendorName: newVendor.trim(),
      billRef: newRef.trim(),
      currency: newCurrency,
      amount: Number(newAmount),
      date: newDate || undefined,
      dueDate: newDueDate || undefined,
    });
  };

  const handleUpdateField = (expense: ExpenseItem, updateData: any) => {
    updateExpenseMutation.mutate({ id: expense._id, data: updateData });
  };

  const handleAddPayment = (expense: ExpenseItem, payment: any) => {
    addPaymentMutation.mutate({ id: expense._id, payment });
  };

  const handleDelete = (expense: ExpenseItem) => {
    if (window.confirm(`Are you sure you want to delete "${expense.title}"?`)) {
      deleteExpenseMutation.mutate(expense._id);
    }
  };

  const columns = useMemo(
    () => AdminExpenseTableColumns(handleUpdateField, handleAddPayment, handleDelete),
    []
  );

  return (
    <div className="px-0 sm:px-1 pb-2 pt-0 w-full overflow-x-auto">
      {/* Top Tab Bar & Action Button */}
      <div className="flex items-center justify-between border-b border-border mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-[#00838f] text-[#00838f]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "list" && (
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#00838f] hover:bg-[#006064] text-white flex items-center gap-2 text-xs font-semibold mb-1">
                <Plus className="w-4 h-4" /> Add New Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[540px]">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-[#00838f]">New Expense / Cost Entry</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
                {/* Row 1: Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Title *</label>
                  <Input
                    placeholder="e.g. Office Rent, Software License, Flight Booking"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>

                {/* Row 2: Category | Vendor */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Category</label>
                    {isAddingNewCategory ? (
                      <div className="flex items-center gap-1">
                        <Input
                          placeholder="New category..."
                          value={customCategoryName}
                          onChange={(e) => setCustomCategoryName(e.target.value)}
                          className="h-9 text-xs"
                          autoFocus
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddCustomCategory}
                          disabled={createCategoryMutation.isPending}
                          className="h-9 px-2.5 text-xs bg-[#00838f] text-white hover:bg-[#006064]"
                        >
                          Save
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setIsAddingNewCategory(false)}
                          className="h-9 px-2 text-xs"
                        >
                          ✕
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Select value={newCategory} onValueChange={setNewCategory}>
                          <SelectTrigger className="h-9 text-xs flex-1">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {dbCategoryNames.length === 0 ? (
                              <div className="p-2 text-[11px] text-slate-400 italic text-center">
                                No categories. Click + to add
                              </div>
                            ) : (
                              dbCategoryNames.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsAddingNewCategory(true)}
                          title="Add new category"
                          className="h-9 w-9 p-0 text-base font-bold border-[#00838f] text-[#00838f] hover:bg-[#e0f7fa] shrink-0"
                        >
                          +
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Vendor</label>
                    <Input
                      placeholder="Vendor Name"
                      value={newVendor}
                      onChange={(e) => setNewVendor(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>

                {/* Row 3: Date, Bill Number, Amount & Currency in 1 row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Date</label>
                    <Input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Bill No</label>
                    <Input
                      placeholder="Ref # or Invoice #"
                      value={newRef}
                      onChange={(e) => setNewRef(e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Amount & Currency *</label>
                    <div className="flex items-center gap-1">
                      <Select value={newCurrency} onValueChange={(val: any) => setNewCurrency(val)}>
                        <SelectTrigger className="w-[68px] h-9 text-xs px-1 shrink-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AED">AED</SelectItem>
                          <SelectItem value="INR">INR</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        className="h-9 text-xs flex-1 min-w-0"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Row 4: Due Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)} className="h-9 text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createExpenseMutation.isPending} className="bg-[#00838f] hover:bg-[#006064] text-white h-9 text-xs">
                    {createExpenseMutation.isPending ? "Saving..." : "Save Expense"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && <ExpensesOverview />}

      {activeTab === "list" && (
        <div className="space-y-6">
          {/* Simple Search & Filter Section (Centered with Wider Gap) */}
          <div className="flex justify-center items-center mb-6 w-full">
            <div className="flex items-center justify-center gap-8 sm:gap-12 md:gap-16 flex-wrap">
              {/* Search Input */}
              <div className="relative flex items-center border-b border-gray-300 dark:border-gray-600 focus-within:border-[#00838f] transition-colors">
                <Search className="w-5 h-5 text-gray-400 absolute left-0" />
                <input
                  type="text"
                  placeholder="Search by title, vendor, ref..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-2 py-2 h-10 w-64 bg-transparent border-none focus:outline-none focus:ring-0 text-foreground text-sm placeholder-gray-400"
                />
              </div>

              {/* Category Filter */}
              <div className="relative flex items-center border-b border-gray-300 dark:border-gray-600 focus-within:border-[#00838f] transition-colors">
                <Filter className="w-4 h-4 text-gray-400 absolute left-0 pointer-events-none" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="pl-6 pr-2 py-2 h-10 w-44 bg-transparent border-none focus:outline-none focus:ring-0 text-foreground text-sm appearance-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {dbCategoryNames.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative flex items-center border-b border-gray-300 dark:border-gray-600 focus-within:border-[#00838f] transition-colors">
                <Filter className="w-4 h-4 text-gray-400 absolute left-0 pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-6 pr-2 py-2 h-10 w-44 bg-transparent border-none focus:outline-none focus:ring-0 text-foreground text-sm appearance-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="partially_paid">Partially Paid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Expenses Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading expenses...</div>
            ) : expenses.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No expense records found. Click "Add New Expense" to create one.</div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-semibold">
                    {columns.map((col, idx) => (
                      <th key={idx} className="px-1.5 py-2 text-[11px] font-semibold whitespace-nowrap">
                        {typeof col.header === "function" ? col.header({ column: col } as any) : col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense._id} className="border-b hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      {columns.map((col: any, idx) => (
                        <td key={idx} className="px-1.5 py-1.5 text-xs">
                          {col.cell ? col.cell({ row: { original: expense } }) : (expense as any)[col.accessorKey]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExpensesAndCosts;
