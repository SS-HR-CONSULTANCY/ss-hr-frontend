export interface PaymentSliceState {
  isAddPaymentFormOpen: boolean;
  isEditPaymentFormOpen: boolean;
  isViewPaymentDetailsOpen: boolean;
  selectedPaymentId: string | null;
}
