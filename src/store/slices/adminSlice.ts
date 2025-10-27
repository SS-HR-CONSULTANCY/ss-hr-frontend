import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { adminSliceIntialState } from "@/types/slice/adminSliceTypes";
import type { AdminFetchReportTableDataResponse } from "@/types/apiTypes/adminApiTypes";
import type { User } from "@/types/entities/user";

const initialState: adminSliceIntialState = {
  reportData: null,
  showAddCompanyForm: false,
  showAddSubAdminForm: false,
  showAddJobForm: false,
  showAddPackageForm: false,
  showAddReviewForm: false,
  selectedAdmin: null,
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
    toggleAddCompanyForm: (state) => {
      state.showAddCompanyForm = !state.showAddCompanyForm;
    },

    toggleAddSubAdminForm: (state) => {
      state.showAddSubAdminForm = !state.showAddSubAdminForm;
    },

    toggleAddJobForm: (state) => {
      state.showAddJobForm = !state.showAddJobForm;
    },

    toggleAddPackageForm: (state) => {
      state.showAddPackageForm = !state.showAddPackageForm;
    },

    toggleAddReviewForm: (state) => {
      state.showAddReviewForm = !state.showAddReviewForm;
    },
    setSelectedAdminId: (state, action: PayloadAction<User>) => {
      state.selectedAdmin = action.payload;
    },
  },
});

export const {
  saveReportData,
  toggleAddCompanyForm,
  toggleAddSubAdminForm,
  toggleAddJobForm,
  toggleAddPackageForm,
  toggleAddReviewForm,
  setSelectedAdminId,
} = adminSlice.actions;
export default adminSlice.reducer;
