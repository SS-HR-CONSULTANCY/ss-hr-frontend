import React from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "@/components/common/CommonTable";
import type { AppDispatch, RootState } from "@/store/store";
import { getAllPayments } from "@/utils/apis/adminPaymentApi";
import AddPaymentForm from "@/components/admin/AddPaymentForm";
import PaymentDetails from "@/components/admin/PaymentDetails";
import EditPaymentForm from "@/components/admin/EditPaymentForm";
import { toggleAddPaymentForm } from "@/store/slices/paymentSlice";
import type { AdminfetchAllPaymentsResponse } from "@/utils/apis/adminPaymentApi";
import { PaymentTableColumns } from "@/components/table/tableColumns/PaymentTableColumns";
import TablePageHeader from "@/components/common/TablePageHeader";
import { Plus } from "lucide-react";

const AdminPayments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
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

      {/* Payments Table */}
      <CommonTable<AdminfetchAllPaymentsResponse>
        fetchApiFunction={getAllPayments}
        queryKey="payments"
        heading=""
        description=""
        column={PaymentTableColumns}
        columnsCount={6}
        showDummyData={false}
        pageSize={10}
      />

      {/* Add Payment Modal */}
      {isAddPaymentFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <AddPaymentForm />
          </div>
        </div>
      )}

      {/* Edit Payment Modal */}
      {isEditPaymentFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <EditPaymentForm />
          </div>
        </div>
      )}

      {/* View Payment Details Modal */}
      {isViewPaymentDetailsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <PaymentDetails />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPayments;