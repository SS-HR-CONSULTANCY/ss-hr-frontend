import React, { useMemo, useCallback, useRef } from "react";
import CommonTable from "@/components/common/CommonTable";
import { AdminEnquiryTableColumns } from "@/components/table/tableColumns/AdminEnquiryTableColumns";
import { adminFetchAllEnquiries, adminDeleteEnquiry,  adminUpdateEnquiryStatus,
  adminUpdateEnquiryAccount,
  adminUpdateEnquiryCategory,
  adminUpdateEnquiryComment
} from "@/utils/apis/adminEnquiryApi";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { openViewEnquiryDetails } from "@/store/slices/enquirySlice";
import EnquiryDetailsModal from "@/components/admin/adminEnquiry/EnquiryDetailsModal";
import type { EnquiryStatusKey } from "@/utils/enquiryStatusConfig";

interface AdminEnquiriesProps {
  defaultStatus?: "need_follow_up";
  columnsType?: "default" | "follow-up";
}

const AdminEnquiries: React.FC<AdminEnquiriesProps> = ({ defaultStatus, columnsType = "default" }) => {
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
    mutationFn: (data: { enquiryId: string; status: EnquiryStatusKey }) => 
      adminUpdateEnquiryStatus(data),
    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({ queryKey: ["adminEnquiries"] });
      const previousEnquiries = queryClient.getQueryData(["adminEnquiries"]);
      queryClient.setQueryData(["adminEnquiries"], (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((enq: any) =>
            enq._id === newStatus.enquiryId ? { ...enq, status: newStatus.status } : enq
          ),
        };
      });
      return { previousEnquiries };
    },
    onError: (error: any, _newStatus, context: any) => {
      if (context?.previousEnquiries) {
        queryClient.setQueryData(["adminEnquiries"], context.previousEnquiries);
      }
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEnquiries"] });
    },
  });

  // Keep a ref always pointing at the latest mutate function so
  // cells captured in useMemo never hold a stale closure.
  const updateStatusMutateRef = useRef(updateStatusMutation.mutate);
  updateStatusMutateRef.current = updateStatusMutation.mutate;

  const fetchEnquiries = async (params?: any) => {
    return await adminFetchAllEnquiries({ ...params, pagination: { ...params?.pagination, status: defaultStatus } });
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
  const handleUpdateStatus = useCallback((enquiryId: string, status: EnquiryStatusKey) => {
    updateStatusMutateRef.current({ enquiryId, status });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty – ref is always current

  const updateAccountMutation = useMutation({
    mutationFn: (data: { enquiryId: string; account: string | null }) => adminUpdateEnquiryAccount(data),
    onMutate: async (newAccount) => {
      await queryClient.cancelQueries({ queryKey: ["adminEnquiries"] });
      const previousEnquiries = queryClient.getQueryData(["adminEnquiries"]);
      queryClient.setQueryData(["adminEnquiries"], (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((enq: any) =>
            enq._id === newAccount.enquiryId ? { ...enq, account: newAccount.account } : enq
          ),
        };
      });
      return { previousEnquiries };
    },
    onSuccess: () => {
      toast.success("Account updated successfully");
    },
    onError: (error: any, _newAccount, context: any) => {
      if (context?.previousEnquiries) {
        queryClient.setQueryData(["adminEnquiries"], context.previousEnquiries);
      }
      toast.error(error?.response?.data?.message || "Failed to update account");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEnquiries"] });
    },
  });

  const updateAccountMutateRef = useRef(updateAccountMutation.mutate);
  updateAccountMutateRef.current = updateAccountMutation.mutate;

  const handleUpdateAccount = useCallback((enquiryId: string, account: string | null) => {
    updateAccountMutateRef.current({ enquiryId, account });
  }, []);

  const updateCategoryMutation = useMutation({
    mutationFn: (data: { enquiryId: string; category: string | null }) => adminUpdateEnquiryCategory(data),
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: ["adminEnquiries"] });
      const previousEnquiries = queryClient.getQueryData(["adminEnquiries"]);
      queryClient.setQueryData(["adminEnquiries"], (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((enq: any) =>
            enq._id === newCategory.enquiryId ? { ...enq, category: newCategory.category } : enq
          ),
        };
      });
      return { previousEnquiries };
    },
    onError: (error: any, _newCategory, context: any) => {
      if (context?.previousEnquiries) {
        queryClient.setQueryData(["adminEnquiries"], context.previousEnquiries);
      }
      toast.error(error?.response?.data?.message || "Failed to update category");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEnquiries"] });
    },
  });

  const updateCategoryMutateRef = useRef(updateCategoryMutation.mutate);
  updateCategoryMutateRef.current = updateCategoryMutation.mutate;

  const handleUpdateCategory = useCallback((enquiryId: string, category: string | null) => {
    updateCategoryMutateRef.current({ enquiryId, category });
  }, []);

  const updateCommentMutation = useMutation({
    mutationFn: (data: { enquiryId: string; comment: string | null }) => adminUpdateEnquiryComment(data),
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ["adminEnquiries"] });
      const previousEnquiries = queryClient.getQueryData(["adminEnquiries"]);
      queryClient.setQueryData(["adminEnquiries"], (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((enq: any) =>
            enq._id === newComment.enquiryId ? { ...enq, comment: newComment.comment } : enq
          ),
        };
      });
      return { previousEnquiries };
    },
    onError: (error: any, _newComment, context: any) => {
      if (context?.previousEnquiries) {
        queryClient.setQueryData(["adminEnquiries"], context.previousEnquiries);
      }
      toast.error(error?.response?.data?.message || "Failed to update comment");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["adminEnquiries"] });
    },
  });

  const updateCommentMutateRef = useRef(updateCommentMutation.mutate);
  updateCommentMutateRef.current = updateCommentMutation.mutate;

  const handleUpdateComment = useCallback((enquiryId: string, comment: string | null) => {
    updateCommentMutateRef.current({ enquiryId, comment });
  }, []);


  const columns = useMemo(() => AdminEnquiryTableColumns(
    handleViewEnquiry,
    handleDeleteEnquiry,
    handleUpdateStatus,
    handleUpdateAccount,
    handleUpdateCategory,
    handleUpdateComment,
    columnsType
  ), [handleViewEnquiry, handleDeleteEnquiry, handleUpdateStatus, handleUpdateAccount, handleUpdateCategory, handleUpdateComment, columnsType]);

  return (
    <div className="px-2 sm:px-6 pb-2 sm:pb-6 -mt-2 w-full max-w-[100vw] overflow-hidden">

      <CommonTable
        column={columns}
        columnsCount={columns.length}
        queryKey="adminEnquiries"
        fetchApiFunction={fetchEnquiries}
        showSearchInput={true}
        searchPlaceholder="Search name, email, phone..."
      />

      {isViewEnquiryDetailsOpen && <EnquiryDetailsModal />}
    </div>
  );
};

export default AdminEnquiries;
