import type { CareerData } from "@/utils/validationSchema";
import type { Address } from "../entities/address";

export interface UserSliceState {
  userAddress: Address | null;
  userCareerData: CareerData | null;
  isAddUserModalOpen: boolean;
  isEditUserModalOpen: boolean;
  isUserDetailsModalOpen: boolean;
  selectedUserId: string | null;
}
