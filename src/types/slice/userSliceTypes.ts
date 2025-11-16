import type { Address } from "../entities/address";
import type { CareerData } from "../entities/careerData";

export interface UserSliceState {
  userAddress: Address | null;
  userCareerData: Partial<CareerData> | null;
  isAddUserModalOpen: boolean;
  isEditUserModalOpen: boolean;
  isUserDetailsModalOpen: boolean;
  selectedUserId: string | null;
}
