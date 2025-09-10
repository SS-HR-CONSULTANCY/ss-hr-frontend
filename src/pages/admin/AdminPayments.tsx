import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import type { AppDispatch, RootState } from "@/store/store";
import { getAllPayments } from "@/utils/apis/paymentApi";
import {
  toggleAddPaymentForm,
} from "@/store/slices/paymentSlice";
import type { AdminfetchAllPaymentsResponse } from "@/utils/apis/paymentApi";
import CommonTable from "@/components/common/CommonTable";
import { PaymentTableColumns } from "@/components/table/tableColumns/PaymentTableColumns";
import AddPaymentForm from "@/components/admin/AddPaymentForm";
import EditPaymentForm from "@/components/admin/EditPaymentForm";
import PaymentDetails from "@/components/admin/PaymentDetails";

const AdminPayments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    isAddPaymentFormOpen,
    isEditPaymentFormOpen,
    isViewPaymentDetailsOpen,
  } = useSelector((state: RootState) => state.payment);



  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center p-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Payments
          </h1>
          <p className="text-sm font-normal text-gray-400">
            Customer payment tracking and management system
          </p>
        </div>
        <Button
          onClick={() => dispatch(toggleAddPaymentForm())}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Add Payment
        </Button>
      </div>

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
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <AddPaymentForm />
          </div>
        </div>
      )}

      {/* Edit Payment Modal */}
      {isEditPaymentFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <EditPaymentForm />
          </div>
        </div>
      )}

      {/* View Payment Details Modal */}
      {isViewPaymentDetailsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <PaymentDetails />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;