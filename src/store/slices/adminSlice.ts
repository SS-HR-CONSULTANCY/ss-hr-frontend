import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { adminSliceIntialState } from "@/types/slice/adminSliceTypes";
import type { AdminFetchReportTableDataResponse } from "@/types/apiTypes/adminApiTypes";

const initialState: adminSliceIntialState = {
  reportData: null,
  showAddJobForm: false,
  showAddPackageForm: false,
};

const adminSlice = createSlice({
  name: "adminSlice",
  initialState: initialState,
  reducers: {
    saveReportData: (
      state,
      action: PayloadAction<Array<AdminFetchReportTableDataResponse>>,
    ) => {
      state.reportData = action.payload;
    },

    toggleAddJobForm: (state) => {
      state.showAddJobForm = !state.showAddJobForm;
    },

    toggleAddPackageForm: (state) => {
      state.showAddPackageForm = !state.showAddPackageForm;
    },

    resetAdminState: () => initialState,
  },
});

export const {
  saveReportData,
  toggleAddJobForm,
  toggleAddPackageForm,
  resetAdminState,
} = adminSlice.actions;
export default adminSlice.reducer;
