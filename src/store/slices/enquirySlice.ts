import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface EnquiryState {
  isViewEnquiryDetailsOpen: boolean;
  selectedEnquiryId: string | null;
}

const initialState: EnquiryState = {
  isViewEnquiryDetailsOpen: false,
  selectedEnquiryId: null,
};

const enquirySlice = createSlice({
  name: "enquiry",
  initialState,
  reducers: {
    openViewEnquiryDetails: (state, action: PayloadAction<string>) => {
      state.isViewEnquiryDetailsOpen = true;
      state.selectedEnquiryId = action.payload;
    },
    closeViewEnquiryDetails: (state) => {
      state.isViewEnquiryDetailsOpen = false;
      state.selectedEnquiryId = null;
    },
  },
});

export const { openViewEnquiryDetails, closeViewEnquiryDetails } = enquirySlice.actions;

export default enquirySlice.reducer;
