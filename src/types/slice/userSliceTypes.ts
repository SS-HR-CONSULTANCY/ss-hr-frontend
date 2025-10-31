import type { Address } from "../entities/address";

export interface UserSliceState {
  userAddress: Address | null;
  isAddUserModalOpen: boolean;
  isEditUserModalOpen: boolean;
  isUserDetailsModalOpen: boolean;
  selectedUserId: string | null;
}
