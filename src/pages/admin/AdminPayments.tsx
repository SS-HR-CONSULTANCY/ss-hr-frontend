import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "@/components/common/CommonTable";
import type { AppDispatch, RootState } from "@/store/store";
import { useAdminPayments } from "@/hooks/useAdminPayments";
import { getAllPayments } from "@/utils/apis/adminPaymentApi";
import AddPaymentForm from "@/components/admin/AddPaymentForm";
import PaymentDetails from "@/components/admin/PaymentDetails";
import EditPaymentForm from "@/components/admin/EditPaymentForm";
import TablePageHeader from "@/components/common/TablePageHeader";
import { toggleAddPaymentForm } from "@/store/slices/paymentSlice";
import type { AdminfetchAllPaymentsResponse } from "@/utils/apis/adminPaymentApi";
import { PaymentTableColumns } from "@/components/table/tableColumns/PaymentTableColumns";

const AdminPayments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    handleDeletePayment,
    handleEditPayment,
    handleViewPayment
  } = useAdminPayments();
  
  const column = PaymentTableColumns(
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
