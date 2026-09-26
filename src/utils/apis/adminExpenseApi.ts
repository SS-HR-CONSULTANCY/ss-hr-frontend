import { axiosInstance } from "@/lib/axios";

export interface ExpenseItem {
  _id: string;
  title: string;
  category: string;
  vendorName?: string;
  billRef?: string;
  currency: "AED" | "INR";
  amount: number;
  paidAmount: number;
  balanceAmount: number;
  paymentHistory: Array<{
    _id?: string;
    date: string;
    amount: number;
    paymentMethod?: string;
    note?: string;
  }>;
  status: "pending" | "partially_paid" | "paid";
  date?: string;
  dueDate?: string;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseSummary {
  totalExpenseAmount: number;
  totalPaidAmount: number;
  totalBalanceAmount: number;
  count: number;
}

export const adminFetchAllExpenses = async (params?: { search?: string; category?: string; status?: string }) => {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.category) query.append("category", params.category);
  if (params?.status) query.append("status", params.status);

  const response = await axiosInstance.get(`/admin/expenses${query.toString() ? `?${query.toString()}` : ""}`);
  return response.data as {
    success: boolean;
    data: ExpenseItem[];
    summary: ExpenseSummary;
  };
};

export const adminCreateExpense = async (data: {
  title: string;
  category?: string;
  vendorName?: string;
  billRef?: string;
  currency?: "AED" | "INR";
  amount: number;
  date?: string;
  dueDate?: string;
  comment?: string;
}) => {
  const response = await axiosInstance.post("/admin/expenses", data);
  return response.data;
};

export const adminUpdateExpense = async (
  id: string,
  data: Partial<{
    title: string;
    category: string;
    vendorName: string;
    billRef: string;
    currency: "AED" | "INR";
    amount: number;
    status: "pending" | "partially_paid" | "paid";
    dueDate: string | null;
    comment: string;
  }>
) => {
  const response = await axiosInstance.patch(`/admin/expenses/${id}`, data);
  return response.data;
};

export const adminAddExpensePayment = async (
  id: string,
  data: { date: string; amount: number; paymentMethod?: string; note?: string }
) => {
  const response = await axiosInstance.post(`/admin/expenses/${id}/payments`, data);
  return response.data;
};

export const adminFetchExpenseCategories = async () => {
  const response = await axiosInstance.get("/admin/expenses/categories");
  return response.data as { success: boolean; data: Array<{ _id: string; name: string }> };
};

export const adminCreateExpenseCategory = async (name: string) => {
  const response = await axiosInstance.post("/admin/expenses/categories", { name });
  return response.data as { success: boolean; data: { _id: string; name: string } };
};

export const adminDeleteExpense = async (id: string) => {
  const response = await axiosInstance.delete(`/admin/expenses/${id}`);
  return response.data;
};
