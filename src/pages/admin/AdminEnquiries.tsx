import React, { useMemo, useCallback, useRef } from "react";
import CommonTable from "@/components/common/CommonTable";
import { AdminEnquiryTableColumns } from "@/components/table/tableColumns/AdminEnquiryTableColumns";
import { adminFetchAllEnquiries, adminDeleteEnquiry, adminUpdateEnquiryStatus, adminUpdateEnquiryAccount, adminUpdateEnquiryCategory } from "@/utils/apis/adminEnquiryApi";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { openViewEnquiryDetails } from "@/store/slices/enquirySlice";
import EnquiryDetailsModal from "@/components/admin/adminEnquiry/EnquiryDetailsModal";

const AdminEnquiries: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isViewEnquiryDetailsOpen = useSelector((state: RootState) => state.enquiry.isViewEnquiryDetailsOpen);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (enquiryId: string) => adminDeleteEnquiry(enquiryId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Enquiry deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["adminEnquiries"] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete enquiry");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (data: { enquiryId: string; status: "pending" | "contacted" | "need_follow_up" | "processing_application" | "completed" }) => 
      adminUpdateEnquiryStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEnquiries"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
  });

  // Keep a ref always pointing at the latest mutate function so
  // cells captured in useMemo never hold a stale closure.
  const updateStatusMutateRef = useRef(updateStatusMutation.mutate);
  updateStatusMutateRef.current = updateStatusMutation.mutate;

  const fetchEnquiries = async (params?: any) => {
    return await adminFetchAllEnquiries(params);
  };

  const handleViewEnquiry = useCallback((enquiryId: string) => {
    dispatch(openViewEnquiryDetails(enquiryId));
  }, [dispatch]);

  const handleDeleteEnquiry = useCallback((enquiryId: string) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      deleteMutation.mutate(enquiryId);
    }
  }, [deleteMutation]);

  // Stable reference – always dispatches via the ref, so columns never stale.
  const handleUpdateStatus = useCallback((enquiryId: string, status: "pending" | "contacted" | "need_follow_up" | "processing_application" | "completed") => {
    updateStatusMutateRef.current({ enquiryId, status });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty – ref is always current

  const updateAccountMutation = useMutation({
    mutationFn: (data: { enquiryId: string; account: string | null }) => adminUpdateEnquiryAccount(data),
    onSuccess: () => {
      toast.success("Account updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminEnquiries"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update account");
    },
  });

  const updateAccountMutateRef = useRef(updateAccountMutation.mutate);
  updateAccountMutateRef.current = updateAccountMutation.mutate;

  const handleUpdateAccount = useCallback((enquiryId: string, account: string | null) => {
    updateAccountMutateRef.current({ enquiryId, account });
  }, []);

  const updateCategoryMutation = useMutation({
    mutationFn: (data: { enquiryId: string; category: string | null }) => adminUpdateEnquiryCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEnquiries"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update category");
    },
  });

  const updateCategoryMutateRef = useRef(updateCategoryMutation.mutate);
  updateCategoryMutateRef.current = updateCategoryMutation.mutate;

  const handleUpdateCategory = useCallback((enquiryId: string, category: string | null) => {
    updateCategoryMutateRef.current({ enquiryId, category });
  }, []);

  const columns = useMemo(() => AdminEnquiryTableColumns(
    handleViewEnquiry,
    handleDeleteEnquiry,
    handleUpdateStatus,
    handleUpdateAccount,
    handleUpdateCategory
  ), [handleViewEnquiry, handleDeleteEnquiry, handleUpdateStatus, handleUpdateAccount, handleUpdateCategory]);

  return (
    <div className="p-2 sm:p-6 w-full max-w-[100vw] overflow-hidden">

      <CommonTable
        column={columns}
        columnsCount={columns.length}
        queryKey="adminEnquiries"
        fetchApiFunction={fetchEnquiries}
      />

      {isViewEnquiryDetailsOpen && <EnquiryDetailsModal />}
    </div>
  );
};

export default AdminEnquiries;
