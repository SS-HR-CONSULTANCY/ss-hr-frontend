import { toast } from "react-toastify";
import type { AppDispatch } from "@/store/store";
import { QueryClient } from "@tanstack/react-query";
import { adminDeleteUser } from "../apis/adminUserApi";
import {
  openEditUserModal,
  openUserDetailsModal,
} from "@/store/slices/userSlice";

export const AdminUserHelper = (
  dispatch: AppDispatch,
  queryClient: QueryClient,
) => {
  const handleViewDetails = (userId: string) => {
    dispatch(openUserDetailsModal(userId));
  };

  const handleEdit = (userId: string) => {
    dispatch(openEditUserModal(userId));
  };

  const handleDelete = async (userId: string) => {
    try {
      const response = await adminDeleteUser(userId);
      if (response.data.success) {
        toast.success("User deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      }
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return { handleViewDetails, handleEdit, handleDelete };
};
