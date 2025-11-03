import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { PaymentSliceState } from "@/types/entities/payment";

const initialState: PaymentSliceState = {
  isAddPaymentFormOpen: false,
  isEditPaymentFormOpen: false,
  isViewPaymentDetailsOpen: false,
  selectedPaymentId: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    toggleAddPaymentForm: (state) => {
      state.isAddPaymentFormOpen = !state.isAddPaymentFormOpen;
    },
    openEditPaymentForm: (state, action: PayloadAction<string>) => {
      state.isEditPaymentFormOpen = true;
      state.selectedPaymentId = action.payload;
    },
    closeEditPaymentForm: (state) => {
      state.isEditPaymentFormOpen = false;
      state.selectedPaymentId = null;
    },
    openViewPaymentDetails: (state, action: PayloadAction<string>) => {
      state.isViewPaymentDetailsOpen = true;
      state.selectedPaymentId = action.payload;
    },
    closeViewPaymentDetails: (state) => {
      state.isViewPaymentDetailsOpen = false;
      state.selectedPaymentId = null;
    },
    resetPaymentSlice: () => initialState,
  },
});

export const {
  toggleAddPaymentForm,
  openEditPaymentForm,
  closeEditPaymentForm,
  openViewPaymentDetails,
  closeViewPaymentDetails,
  resetPaymentSlice,
} = paymentSlice.actions;

export default paymentSlice.reducer;
