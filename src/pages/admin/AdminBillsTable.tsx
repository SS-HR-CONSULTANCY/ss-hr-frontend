import React, { useMemo, useRef } from "react";
import CommonTable from "@/components/common/CommonTable";
import { AdminBillsTableColumns } from "@/components/table/tableColumns/AdminBillsTableColumns";
import { adminFetchAllBills, adminUpdateBill, adminAddBillPayment } from "@/utils/apis/adminBillApi";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { AdminFetchAllBillsResponse } from "@/types/apiTypes/adminApiTypes";

const AdminBillsTable: React.FC = () => {
  const queryClient = useQueryClient();

  const updateBillMutation = useMutation({
    mutationFn: (data: { enquiryId: string; enquiryType: string; invoiceAmount?: number; currency?: string; status?: string; comment?: string }) => 
      adminUpdateBill(data),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["adminBills"] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update bill");
    },
  });

  const addPaymentMutation = useMutation({
    mutationFn: (data: { enquiryId: string; enquiryType: string; date: string; amount: number }) => 
      adminAddBillPayment(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Payment added successfully");
        queryClient.invalidateQueries({ queryKey: ["adminBills"] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add payment");
    },
  });

  const updateBillMutateRef = useRef(updateBillMutation.mutate);
  updateBillMutateRef.current = updateBillMutation.mutate;
  const addPaymentMutateRef = useRef(addPaymentMutation.mutate);
  addPaymentMutateRef.current = addPaymentMutation.mutate;

  const handleUpdateInvoiceAmount = React.useCallback((enquiry: AdminFetchAllBillsResponse, amount: number, currency: string) => {
    updateBillMutateRef.current({ enquiryId: enquiry._id, enquiryType: enquiry.enquiryType, invoiceAmount: amount, currency });
  }, []);

  const handleUpdateStatus = React.useCallback((enquiry: AdminFetchAllBillsResponse, status: string) => {
    updateBillMutateRef.current({ enquiryId: enquiry._id, enquiryType: enquiry.enquiryType, status });
  }, []);

  const handleUpdateServiceStatus = React.useCallback((enquiry: AdminFetchAllBillsResponse, serviceStatus: string) => {
    updateBillMutateRef.current({ enquiryId: enquiry._id, enquiryType: enquiry.enquiryType, serviceStatus });
  }, []);

  const handleUpdateDueDate = React.useCallback((enquiry: AdminFetchAllBillsResponse, dueDate: string) => {
    updateBillMutateRef.current({ enquiryId: enquiry._id, enquiryType: enquiry.enquiryType, dueDate });
  }, []);

  const handleAddPayment = React.useCallback((enquiry: AdminFetchAllBillsResponse, payment: { date: string, amount: number }) => {
    addPaymentMutateRef.current({ enquiryId: enquiry._id, enquiryType: enquiry.enquiryType, ...payment });
  }, []);

  const columns = useMemo(() => AdminBillsTableColumns(
    handleUpdateInvoiceAmount,
    handleUpdateStatus,
    handleAddPayment,
    handleUpdateDueDate,
    handleUpdateServiceStatus
  ), [
    handleUpdateInvoiceAmount,
    handleUpdateStatus,
    handleAddPayment,
    handleUpdateDueDate,
    handleUpdateServiceStatus
  ]);

  return (
    <div className="w-full h-full overflow-hidden">
      <CommonTable
        column={columns}
        columnsCount={columns.length}
        queryKey="adminBills"
        fetchApiFunction={adminFetchAllBills as any}
        showSearchInput={true}
        searchPlaceholder="Search by name or phone..."
      />
    </div>
  );
};

export default AdminBillsTable;
