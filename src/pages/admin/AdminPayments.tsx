import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "@/components/common/CommonTable";
import type { AppDispatch, RootState } from "@/store/store";
import { useAdminPayments } from "@/hooks/useAdminPayments";
import { getAllPayments } from "@/utils/apis/adminPaymentApi";
import TablePageHeader from "@/components/common/TablePageHeader";
import { toggleAddPaymentForm } from "@/store/slices/paymentSlice";
import AddPaymentForm from "@/components/admin/adminPayment/AddPaymentForm";
import PaymentDetails from "@/components/admin/adminPayment/PaymentDetails";
import EditPaymentForm from "@/components/admin/adminPayment/EditPaymentForm";
import type { AdminfetchAllPaymentsResponse } from "@/utils/apis/adminPaymentApi";
import { AdminPaymentTableColumns } from "@/components/table/tableColumns/AdminPaymentTableColumns";

const AdminPayments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { handleDeletePayment, handleEditPayment, handleViewPayment } =
    useAdminPayments();

  const column = AdminPaymentTableColumns(
    handleDeletePayment,
    handleEditPayment,
    handleViewPayment,
  );

  const {
    isAddPaymentFormOpen,
    isEditPaymentFormOpen,
    isViewPaymentDetailsOpen,
  } = useSelector((state: RootState) => state.payment);

  return (
    <>
      <TablePageHeader
        title="Payments"
        subtitle="Customer payment tracking and management system"
        actionButton={
          <Button
            onClick={() => dispatch(toggleAddPaymentForm())}
            variant="outline"
          >
            <Plus className="h-5 w-5" />
            Add New Payment
          </Button>
        }
      />

      <CommonTable<AdminfetchAllPaymentsResponse>
        fetchApiFunction={getAllPayments}
        queryKey="payments"
        heading=""
        description=""
        column={column}
        columnsCount={6}
        showDummyData={false}
        pageSize={10}
      />

      {isAddPaymentFormOpen && <AddPaymentForm />}
      {isEditPaymentFormOpen && <EditPaymentForm />}
      {isViewPaymentDetailsOpen && <PaymentDetails />}
    </>
  );
};

export default AdminPayments;
