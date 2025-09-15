import { toast } from "react-toastify";
import { QueryClient } from "@tanstack/react-query";
import { deleteAdmin } from "../apis/adminSettingsApi";

export const AdminSettingsHelper = (
    // dispatch: AppDispatch,
    queryClient: QueryClient,
) => {

    // const handleViewDetails = (userId: string) => {
    //     dispatch(openUserDetailsModal(userId))
    // };

    // const handleEdit = (userId: string) => {
    //     dispatch(openEditUserModal(userId))
    // };

    const handleDelete = async (adminId: string) => {
        try {
            const response = await deleteAdmin(adminId);
            if (response.success) {
                toast.success('Admin deleted successfully');
                queryClient.invalidateQueries({ queryKey: ['admins'] });
            }
        } catch {
            toast.error('Failed to delete admin');
        }
    };

    return { handleDelete };
};
