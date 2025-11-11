export type PaymentMethod = "googlepay" | "banktransfer" | "cash";
export type PaymentStatus = "fullyPaid" | "partiallyPaid" | "pending";

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
  paymentMethod: PaymentMethod;
  paymentDate: string;
  paymentStatus: PaymentStatus;
  referenceId: string;
  paymentProof: string;
  adminNotes: string;
  status: PaymentMethod;
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
  paymentMethod: PaymentMethod;
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
  paymentMethod?: PaymentMethod;
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
