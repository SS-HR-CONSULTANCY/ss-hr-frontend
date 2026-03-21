import React, { useState } from "react";
import { FileText, Receipt, TrendingDown } from "lucide-react";
import { useSelector } from "react-redux";
import CommonTable from "@/components/common/CommonTable";
import type { RootState } from "@/store/store";
import { useAdminPayments } from "@/hooks/useAdminPayments";
import { getAllPayments, getPaymentStats } from "@/utils/apis/adminPaymentApi";
import AddPaymentForm from "@/components/admin/adminPayment/AddPaymentForm";
import AddInvoiceForm from "@/components/admin/adminPayment/AddInvoiceForm";
import AddExpenseForm from "@/components/admin/adminPayment/AddExpenseForm";
import AddReceiptForm from "@/components/admin/adminPayment/AddReceiptForm";
import PaymentDetails from "@/components/admin/adminPayment/PaymentDetails";
import EditPaymentForm from "@/components/admin/adminPayment/EditPaymentForm";
import type { AdminfetchAllPaymentsResponse } from "@/utils/apis/adminPaymentApi";
import { AdminPaymentTableColumns } from "@/components/table/tableColumns/AdminPaymentTableColumns";
import { useQuery } from "@tanstack/react-query";
import { formatNumberToPrice } from "@/utils/helpers/priceFormater";
import { PAYMENT_TYPE_CATEGORIES } from "@/utils/constants";

const ACTION_BUTTONS = [
  {
    key: "expense",
    label: "Book Expense",
    icon: TrendingDown,
    bg: "bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40",
    iconColor: "text-red-600 dark:text-red-400",
    border: "border border-red-200 dark:border-red-800",
    textColor: "text-red-700 dark:text-red-300",
  },
  {
    key: "invoice",
    label: "Add Invoice",
    icon: FileText,
    bg: "bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/40",
    iconColor: "text-orange-600 dark:text-orange-400",
    border: "border border-orange-200 dark:border-orange-800",
    textColor: "text-orange-700 dark:text-orange-300",
  },
  {
    key: "receipt",
    label: "Add Receipt",
    icon: Receipt,
    bg: "bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40",
    iconColor: "text-green-600 dark:text-green-400",
    border: "border border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-300",
  },
];

const AdminPayments: React.FC = () => {
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const { handleDeletePayment, handleEditPayment, handleViewPayment } =
    useAdminPayments();

  const column = AdminPaymentTableColumns(
    handleDeletePayment,
    handleEditPayment,
    handleViewPayment,
  );

  const { isAddPaymentFormOpen, isEditPaymentFormOpen, isViewPaymentDetailsOpen } =
    useSelector((state: RootState) => state.payment);

  const { data: stats } = useQuery({
    queryKey: ["paymentStats"],
    queryFn: getPaymentStats,
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleAction = (key: string) => {
    if (key === "invoice") setIsInvoiceOpen(true);
    else if (key === "expense") setIsExpenseOpen(true);
    else if (key === "receipt") setIsReceiptOpen(true);
  };

  return (
    <>
      {/* Page Title */}
      <div className="px-6 pt-5 pb-2">
        <h1 className="text-xl font-bold tracking-tight">Payment Tracking</h1>
      </div>

      {/* 3 Centered Action Buttons */}
      <div className="flex justify-center gap-6 px-6 py-6">
        {ACTION_BUTTONS.map(({ key, label, icon: Icon, bg, iconColor, border, textColor }) => (
          <button
            key={key}
            onClick={() => handleAction(key)}
            className={`flex flex-col items-center gap-3 px-10 py-6 rounded-2xl ${bg} ${border} transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md group`}
          >
            <div className={`p-3 rounded-full bg-white/70 dark:bg-black/20 shadow-inner`}>
              <Icon className={`h-7 w-7 ${iconColor}`} />
            </div>
            <span className={`text-sm font-semibold ${textColor}`}>{label}</span>
          </button>
        ))}
      </div>

      {/* Compact Stats Chips */}
      <div className="flex justify-center gap-3 px-6 pb-5">
        {[
          { label: "Payments", value: stats?.totalPayments ?? 0, price: false, dot: "bg-blue-500" },
          { label: "Revenue", value: stats?.totalRevenue ?? 0, price: true, dot: "bg-green-500" },
          { label: "Pending", value: stats?.totalPending ?? 0, price: true, dot: "bg-orange-400" },
        ].map(({ label, value, price, dot }) => (
          <div
            key={label}
            className="inline-flex items-center gap-2 bg-muted/60 dark:bg-muted/20 border rounded-full px-4 py-1.5 text-xs shadow-sm"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
            <span className="text-muted-foreground">{label}</span>
            <span className="font-semibold text-foreground">
              {price ? formatNumberToPrice(value) : value}
            </span>
          </div>
        ))}
      </div>

      {/* Table */}
      <CommonTable<AdminfetchAllPaymentsResponse>
        fetchApiFunction={getAllPayments}
        queryKey="payments"
        column={column}
        columnsCount={6}
        pageSize={10}
        showCategoryFilter={true}
        categoryOptions={PAYMENT_TYPE_CATEGORIES}
      />

      {isAddPaymentFormOpen && <AddPaymentForm />}
      {isEditPaymentFormOpen && <EditPaymentForm />}
      {isViewPaymentDetailsOpen && <PaymentDetails />}
      {isExpenseOpen && <AddExpenseForm onClose={() => setIsExpenseOpen(false)} />}
      {isInvoiceOpen && <AddInvoiceForm onClose={() => setIsInvoiceOpen(false)} />}
      {isReceiptOpen && <AddReceiptForm onClose={() => setIsReceiptOpen(false)} />}
    </>
  );
};

export default AdminPayments;
