import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "@/store/store";
import { useQueryClient } from "@tanstack/react-query";
import { adminDeleteUser } from "@/utils/apis/adminUserApi";
import { openEditUserModal } from "@/store/slices/userSlice";

export const useAdminUsers = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();

  const handleViewDetails = (userId: string) => {
    navigate(`/ss-hr-admin/users/${userId}`);
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
