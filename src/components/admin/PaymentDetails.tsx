import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { RootState, AppDispatch } from "@/store/store";
import { closeViewPaymentDetails } from "@/store/slices/paymentSlice";
import { getPaymentById } from "@/utils/apis/adminPaymentApi";

const PaymentDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedPaymentId } = useSelector((state: RootState) => state.payment);

  const { data: paymentData, isLoading } = useQuery({
    queryKey: ["payment", selectedPaymentId],
    queryFn: () => getPaymentById(selectedPaymentId!),
    enabled: !!selectedPaymentId,
  });

  const handleClose = () => {
    dispatch(closeViewPaymentDetails());
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData?.payment) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium">Payment not found</p>
          <p className="text-gray-600 mt-2">The requested payment could not be loaded.</p>
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
      case 'pending':
        return "bg-yellow-100 text-yellow-800";
      case 'partiallypaid':
        return "bg-blue-100 text-blue-800";
      case 'fullypaid':
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'partiallypaid':
        return 'Partially Paid';
      case 'fullypaid':
        return 'Fully Paid';
      default:
        return status;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'googlepay':
        return 'Google Pay';
      case 'banktransfer':
        return 'Bank Transfer';
      case 'cash':
        return 'Cash';
      default:
        return method;
    }
  };

  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black">Payment Details</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(paymentDetails.status)}`}>
          {getStatusLabel(paymentDetails.status)}
        </span>
      </div>

      <div className="space-y-6">
        {/* Customer & Package Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-black mb-3">Customer Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Customer Name:</span>
                <p className="font-medium text-black">{paymentDetails.customerName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Customer ID:</span>
                <p className="text-sm text-gray-800 font-mono">{paymentDetails.customerId}</p>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-black mb-3">Package Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Package Name:</span>
                <p className="font-medium text-black">{paymentDetails.packageName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Package ID:</span>
                <p className="text-sm text-gray-800 font-mono">{paymentDetails.packageId}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-black mb-4">Payment Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600 block">Total Amount</span>
              <span className="text-lg font-bold text-black">{formatCurrency(paymentDetails.totalAmount)}</span>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-gray-600 block">Paid Amount</span>
              <span className="text-lg font-bold text-green-600">{formatCurrency(paymentDetails.paidAmount)}</span>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-gray-600 block">Balance Amount</span>
              <span className={`text-lg font-bold ${paymentDetails.balanceAmount > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                {formatCurrency(paymentDetails.balanceAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-black mb-3">Payment Information</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Payment Method:</span>
                <p className="font-medium text-black">{getPaymentMethodLabel(paymentDetails.paymentMethod)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Payment Date:</span>
                <p className="font-medium text-black">{formatDate(paymentDetails.paymentDate)}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Reference ID:</span>
                <p className="font-medium text-black font-mono">{paymentDetails.referenceId}</p>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-black mb-3">Payment Proof</h3>
            <div className="space-y-2">
              <span className="text-sm text-gray-600">Screenshot/Receipt URL:</span>
              <div className="p-2 bg-gray-50 rounded border">
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
                onClick={() => window.open(paymentDetails.paymentProof, '_blank')}
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
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-semibold text-black mb-3">Admin Notes</h3>
            <p className="text-gray-700 leading-relaxed">{paymentDetails.adminNotes}</p>
          </div>
        )}

        {/* Timestamps */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-black mb-3">Record Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Created:</span>
              <p className="font-medium text-black">{formatDate(paymentDetails.createdAt)}</p>
            </div>
            <div>
              <span className="text-gray-600">Last Updated:</span>
              <p className="font-medium text-black">{formatDate(paymentDetails.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button
          onClick={handleClose}
          variant="outline"
          className="border-gray-300 text-black hover:bg-gray-50"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default PaymentDetails;