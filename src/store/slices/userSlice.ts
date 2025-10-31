import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserSliceState } from "../../types/slice/userSliceTypes";
import type { Address } from "@/types/entities/address";

const initialState: UserSliceState = {
  userAddress: null, 
  selectedUserId: null,
  isAddUserModalOpen: false,
  isEditUserModalOpen: false,
  isUserDetailsModalOpen: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    openAddUserModal: (state) => {
      state.isAddUserModalOpen = true;
    },
    closeAddUserModal: (state) => {
      state.isAddUserModalOpen = false;
    },
    openEditUserModal: (state, action: PayloadAction<string>) => {
      state.isEditUserModalOpen = true;
      state.selectedUserId = action.payload;
    },
    closeEditUserModal: (state) => {
      state.isEditUserModalOpen = false;
      state.selectedUserId = null;
    },
    openUserDetailsModal: (state, action: PayloadAction<string>) => {
      state.isUserDetailsModalOpen = true;
      state.selectedUserId = action.payload;
    },
    closeUserDetailsModal: (state) => {
      state.isUserDetailsModalOpen = false;
      state.selectedUserId = null;
    },
    setAddress: (state, action: PayloadAction<Address>) => {
      state.userAddress = action.payload;
    }
  },
});

export const {
  openAddUserModal,
  closeAddUserModal,
  openEditUserModal,
  closeEditUserModal,
  openUserDetailsModal,
  closeUserDetailsModal,
} = userSlice.actions;

export default userSlice.reducer;
