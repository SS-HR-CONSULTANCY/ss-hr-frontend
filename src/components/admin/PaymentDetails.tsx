import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { RootState, AppDispatch } from "@/store/store";
import { closeViewPaymentDetails } from "@/store/slices/paymentSlice";
import { getPaymentById } from "@/utils/apis/adminPaymentApi";
import FormLoading from "../form/FormLoading";

const PaymentDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedPaymentId } = useSelector(
    (state: RootState) => state.payment,
  );

  const { data: paymentData, isLoading } = useQuery({
    queryKey: ["payment", selectedPaymentId],
    queryFn: () => getPaymentById(selectedPaymentId!),
    enabled: !!selectedPaymentId,
  });

  const handleClose = () => {
    dispatch(closeViewPaymentDetails());
  };

  if (isLoading) {
    return <FormLoading />;
  }

  if (!paymentData?.payment) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium">Payment not found</p>
          <p className="text-gray-600 mt-2">
            The requested payment could not be loaded.
          </p>
          <Button onClick={handleClose} className="mt-4" variant="outline">
            Close
          </Button>
        </div>
      </div>
    );
  }

  const { payment: paymentDetails } = paymentData;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "partiallypaid":
        return "bg-blue-100 text-blue-800";
      case "fullypaid":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "partiallypaid":
        return "Partially Paid";
      case "fullypaid":
        return "Fully Paid";
      default:
        return status;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "googlepay":
        return "Google Pay";
      case "banktransfer":
        return "Bank Transfer";
      case "cash":
        return "Cash";
      default:
        return method;
    }
  };

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Payment Details</h2>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(paymentDetails.status)}`}
        >
          {getStatusLabel(paymentDetails.status)}
        </span>
      </div>

      <div className="space-y-6">
        {/* Customer & Package Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm ">Customer Name:</span>
                <p className="font-medium ">{paymentDetails.customerName}</p>
              </div>
              <div>
                <span className="text-sm ">Customer ID:</span>
                <p className="text-sm font-mono">{paymentDetails.customerId}</p>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold  mb-3">Package Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm ">Package Name:</span>
                <p className="font-medium ">{paymentDetails.packageName}</p>
              </div>
              <div>
                <span className="text-sm ">Package ID:</span>
                <p className="text-sm font-mono">{paymentDetails.packageId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="p-4 border  rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <span className="text-sm  block">Total Amount</span>
              <span className="text-lg font-bold ">
                {formatCurrency(paymentDetails.totalAmount)}
              </span>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <span className="text-sm  block">Paid Amount</span>
              <span className="text-lg font-bold ">
                {formatCurrency(paymentDetails.paidAmount)}
              </span>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <span className="text-sm  block">Balance Amount</span>
              <span
                className={`text-lg font-bold ${paymentDetails.balanceAmount > 0 ? "text-red-600" : ""}`}
              >
                {formatCurrency(paymentDetails.balanceAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold  mb-3">Payment Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm ">Payment Method:</span>
                <p className="font-medium ">
                  {getPaymentMethodLabel(paymentDetails.paymentMethod)}
                </p>
              </div>
              <div>
                <span className="text-sm ">Payment Date:</span>
                <p className="font-medium ">
                  {formatDate(paymentDetails.paymentDate)}
                </p>
              </div>
              <div>
                <span className="text-sm ">Reference ID:</span>
                <p className="font-medium  font-mono">
                  {paymentDetails.referenceId}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold  mb-3">Payment Proof</h3>
            <div className="space-y-2">
              <span className="text-sm ">Screenshot/Receipt URL:</span>
              <div className="p-2 rounded border">
                <a
                  href={paymentDetails.paymentProof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm break-all"
                >
                  {paymentDetails.paymentProof}
                </a>
              </div>
              <Button
                onClick={() =>
                  window.open(paymentDetails.paymentProof, "_blank")
                }
                variant="outline"
                size="sm"
                className="mt-2"
              >
                View Proof
              </Button>
            </div>
          </div>
        </div>

        {/* Admin Notes */}
        {paymentDetails.adminNotes && (
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Admin Notes</h3>
            <p className="leading-relaxed">{paymentDetails.adminNotes}</p>
          </div>
        )}

        {/* Timestamps */}
        <div className="p-4 border rounded-lg">
          <h3 className="text-lg font-semibold  mb-3">Record Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="">Created:</span>
              <p className="font-medium ">
                {formatDate(paymentDetails.createdAt)}
              </p>
            </div>
            <div>
              <span className="">Last Updated:</span>
              <p className="font-medium ">
                {formatDate(paymentDetails.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button onClick={handleClose} variant="outline">
          Close
        </Button>
      </div>
    </div>
  );
};

export default PaymentDetails;
