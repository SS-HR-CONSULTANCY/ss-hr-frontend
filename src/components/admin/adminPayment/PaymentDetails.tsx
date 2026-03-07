import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { getPaymentById } from "@/utils/apis/adminPaymentApi";
import { closeViewPaymentDetails } from "@/store/slices/paymentSlice";
import FormLoading from "@/components/form/FormLoading";

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
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Unified Record Details</h2>
          </div>

          <div className="space-y-6">
            {/* Customer & Package Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-3">
                  Customer Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm ">Customer Name:</span>
                    <p className="font-medium ">
                      {paymentDetails.customerName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold  mb-3">
                  Package Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm ">Package Name:</span>
                    <p className="font-medium ">{paymentDetails.packageName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="p-4 border  rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <span className="text-sm  block">Paid Amount</span>
                  <span className="text-lg font-bold ">
                    {formatCurrency(paymentDetails.paidAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment & Record Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Payment Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-sm text-gray-500">Method:</span>
                    <span className="font-medium text-sm">{getPaymentMethodLabel(paymentDetails.paymentMethod)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-sm text-gray-500">Date:</span>
                    <span className="font-medium text-sm">{formatDate(paymentDetails.paymentDate)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Record Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-sm text-gray-500">Created:</span>
                    <span className="font-medium text-xs">{formatDate(paymentDetails.createdAt)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-sm text-gray-500">Updated:</span>
                    <span className="font-medium text-xs">{formatDate(paymentDetails.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Receipt Information */}
            <div className="grid grid-cols-1 gap-6">
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Receipt Information</h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-500 block">Receipt Link (Drive):</span>
                    {paymentDetails.paymentProof ? (
                      <div className="mt-1 flex items-center gap-2">
                        <Button 
                          onClick={() => window.open(paymentDetails.paymentProof, "_blank")}
                          variant="outline" 
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View Receipt
                        </Button>
                      </div>
                    ) : (
                      <p className="text-gray-400 italic text-sm mt-1">No Receipt Link</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Click the button above to open the document proof in a new tab.
                    </p>
                  </div>
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
              <h3 className="text-lg font-semibold  mb-3">
                Record Information
              </h3>
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
      </div>
    </div>
  );
};

export default PaymentDetails;
