export interface Payment {
  _id: string;
  customerId: string;
  username: string;
  packageId: string;
  transactionId: string;
  customerName: string;
  packageName: string;
  totalAmount: number;
  paidAmount: number;
  discountAmount: number;
  balanceAmount: number;
  paymentMethod: "googlepay" | "banktransfer" | "cash";
  paymentDate: string;
  paymentStatus: string;
  referenceId: string;
  paymentProof: string;
  adminNotes: string;
  status: "pending" | "partiallypaid" | "fullypaid";
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentFormData {
  customerId: string;
  packageId: string;
  customerName: string;
  packageName: string;
  totalAmount: number;
  paidAmount: number;
  paymentMethod: "googlepay" | "banktransfer" | "cash";
  paymentDate: string;
  referenceId: string;
  paymentProof: string;
  adminNotes: string;
}

export interface UpdatePaymentFormData {
  customerId?: string;
  packageId?: string;
  customerName?: string;
  packageName?: string;
  totalAmount?: number;
  paidAmount?: number;
  paymentMethod?: "googlepay" | "banktransfer" | "cash";
  paymentDate?: string;
  referenceId?: string;
  paymentProof?: string;
  adminNotes?: string;
}

export interface PaymentSliceState {
  isAddPaymentFormOpen: boolean;
  isEditPaymentFormOpen: boolean;
  isViewPaymentDetailsOpen: boolean;
  selectedPaymentId: string | null;
}
