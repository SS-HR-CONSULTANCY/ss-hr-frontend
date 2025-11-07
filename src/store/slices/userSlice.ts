import { signin } from "@/utils/apis/authApi";
import type { Address } from "@/types/entities/address";
import type { CareerData } from "@/types/entities/careerData";
import type { SigninResponse } from "@/types/apiTypes/authApiTypes";
import { createAddress, createCareerData } from "@/utils/apis/userApi";
import type { UserSliceState } from "../../types/slice/userSliceTypes";
import { createSlice, type ActionReducerMapBuilder, type PayloadAction } from "@reduxjs/toolkit";
import type { CreateOrUpdateCareerDataResponse, UpdateAddressResponse } from "@/types/apiTypes/userApiTypes";

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
      });

    builder.addCase(
      createCareerData.fulfilled,
      (state, action: PayloadAction<CreateOrUpdateCareerDataResponse>) => {
        state.userCareerData = { ...action.payload.data }
      });

    builder.addCase(
      signin.fulfilled,
      (state, action: PayloadAction<SigninResponse>) => {
        state.userAddress = {
          ...(state.userAddress ?? ({} as Address)),
          ...action.payload.address,
        } as Address;
        state.userCareerData = {
          ...(state.userAddress ?? ({} as CareerData)),
          ...action.payload.careerData,
        } as CareerData;
      });
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
