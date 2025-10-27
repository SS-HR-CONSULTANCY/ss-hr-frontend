import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { PackageSliceState } from "@/types/slice/packageSliceTypes";

const initialState: PackageSliceState = {
  isAddPackageFormOpen: false,
  isEditPackageFormOpen: false,
  isViewPackageDetailsOpen: false,
  selectedPackageId: null,
};

const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    toggleAddPackageForm: (state) => {
      state.isAddPackageFormOpen = !state.isAddPackageFormOpen;
    },
    openEditPackageForm: (state, action: PayloadAction<string>) => {
      state.isEditPackageFormOpen = true;
      state.selectedPackageId = action.payload;
    },
    closeEditPackageForm: (state) => {
      state.isEditPackageFormOpen = false;
      state.selectedPackageId = null;
    },
    openViewPackageDetails: (state, action: PayloadAction<string>) => {
      state.isViewPackageDetailsOpen = true;
      state.selectedPackageId = action.payload;
    },
    closeViewPackageDetails: (state) => {
      state.isViewPackageDetailsOpen = false;
      state.selectedPackageId = null;
    },
    closeAllPackageModals: (state) => {
      state.isAddPackageFormOpen = false;
      state.isEditPackageFormOpen = false;
      state.isViewPackageDetailsOpen = false;
      state.selectedPackageId = null;
    },
  },
});

export const {
  toggleAddPackageForm,
  openEditPackageForm,
  closeEditPackageForm,
  openViewPackageDetails,
  closeViewPackageDetails,
  closeAllPackageModals,
} = packageSlice.actions;

export default packageSlice.reducer;
