import type { Address } from "@/types/entities/address";
import { createSlice, type ActionReducerMapBuilder, type PayloadAction } from "@reduxjs/toolkit";
import type { UserSliceState } from "../../types/slice/userSliceTypes";
import { createAddress } from "@/utils/apis/userApi";
import type { UpdateAddressResponse } from "@/types/apiTypes/userApiTypes";

const initialState: UserSliceState = {
  userAddress: null, 
  userCareerData: null,
  selectedUserId: null,
  isAddUserModalOpen: false,
  isEditUserModalOpen: false,
  isUserDetailsModalOpen: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    openAddUserModal: (state: UserSliceState) => {
      state.isAddUserModalOpen = true;
    },
    closeAddUserModal: (state: UserSliceState) => {
      state.isAddUserModalOpen = false;
    },
    openEditUserModal: (state: UserSliceState, action: PayloadAction<string>) => {
      state.isEditUserModalOpen = true;
      state.selectedUserId = action.payload;
    },
    closeEditUserModal: (state: UserSliceState) => {
      state.isEditUserModalOpen = false;
      state.selectedUserId = null;
    },
    openUserDetailsModal: (state: UserSliceState, action: PayloadAction<string>) => {
      state.isUserDetailsModalOpen = true;
      state.selectedUserId = action.payload;
    },
    closeUserDetailsModal: (state: UserSliceState) => {
      state.isUserDetailsModalOpen = false;
      state.selectedUserId = null;
    },
    setAddress: (state: UserSliceState, action: PayloadAction<Address>) => {
      state.userAddress = action.payload;
    },
    resetUserSlice: () => initialState,
  },
  extraReducers: (builder: ActionReducerMapBuilder<UserSliceState>) => {
    builder.addCase(
      createAddress.fulfilled,
      (state, action: PayloadAction<UpdateAddressResponse>) => {
        state.userAddress = {
          ...(state.userAddress ?? ({} as Address)),
          ...action.payload.data,
        } as Address;
        console.log("Address : ",state.userAddress);
      }
    )
  }
});

export const {
  openAddUserModal,
  closeAddUserModal,
  openEditUserModal,
  closeEditUserModal,
  openUserDetailsModal,
  closeUserDetailsModal,
  resetUserSlice
} = userSlice.actions;

export default userSlice.reducer;
