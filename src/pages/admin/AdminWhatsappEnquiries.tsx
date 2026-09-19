import React, { useState, useCallback, useMemo, useRef } from "react";
import CommonTable from "@/components/common/CommonTable";
import { AdminWhatsappEnquiryTableColumns } from "@/components/table/tableColumns/AdminWhatsappEnquiryTableColumns";
import { adminFetchAllWhatsappEnquiries, adminDeleteWhatsappEnquiry, adminUpdateWhatsappEnquiryStatus, adminUpdateWhatsappEnquiry } from "@/utils/apis/adminWhatsappEnquiryApi";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import WhatsappEnquiryModal from "@/components/admin/whatsappEnquiry/WhatsappEnquiryModal";
import type { AdminFetchAllWhatsappEnquiriesResponse } from "@/types/apiTypes/adminApiTypes";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AdminWhatsappEnquiries: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdminFetchAllWhatsappEnquiriesResponse | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (enquiryId: string) => adminDeleteWhatsappEnquiry(enquiryId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Enquiry deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["adminWhatsappEnquiries"] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete enquiry");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: (data: { enquiryId: string; status: "pending" | "contacted" | "need_follow_up" | "processing_application" | "completed" }) => 
      adminUpdateWhatsappEnquiryStatus(data),
    onMutate: async (newStatus) => {
      await queryClient.cancelQueries({ queryKey: ["adminWhatsappEnquiries"] });
      const previousEnquiries = queryClient.getQueryData(["adminWhatsappEnquiries"]);
      queryClient.setQueryData(["adminWhatsappEnquiries"], (old: any) => {
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
        queryClient.setQueryData(["adminWhatsappEnquiries"], context.previousEnquiries);
      }
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["adminWhatsappEnquiries"] });
    },
  });

  // Keep a stable ref so memoized column cells never hold a stale mutate closure.
  const updateStatusMutateRef = useRef(updateStatusMutation.mutate);
  updateStatusMutateRef.current = updateStatusMutation.mutate;

  const fetchEnquiries = async (params?: any) => {
    return await adminFetchAllWhatsappEnquiries(params);
  };

  const handleEditEnquiry = useCallback((enquiry: AdminFetchAllWhatsappEnquiriesResponse) => {
    setSelectedEnquiry(enquiry);
    setIsModalOpen(true);
  }, []);

  const handleAddEnquiry = useCallback(() => {
    setSelectedEnquiry(null);
    setIsModalOpen(true);
  }, []);

  const handleDeleteEnquiry = useCallback((enquiryId: string) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      deleteMutation.mutate(enquiryId);
    }
  }, [deleteMutation]);

  // Stable – always calls via ref, never stale inside useMemo columns.
  const handleUpdateStatus = useCallback((enquiryId: string, status: "pending" | "contacted" | "need_follow_up" | "processing_application" | "completed") => {
    updateStatusMutateRef.current({ enquiryId, status });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty dep array

  const updateAccountMutation = useMutation({
    mutationFn: (data: { enquiryId: string; account: string | null }) =>
      adminUpdateWhatsappEnquiry(data.enquiryId, { account: data.account }),
    onMutate: async (newAccount) => {
      await queryClient.cancelQueries({ queryKey: ["adminWhatsappEnquiries"] });
      const previousEnquiries = queryClient.getQueryData(["adminWhatsappEnquiries"]);
      queryClient.setQueryData(["adminWhatsappEnquiries"], (old: any) => {
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
        queryClient.setQueryData(["adminWhatsappEnquiries"], context.previousEnquiries);
      }
      toast.error(error?.response?.data?.message || "Failed to update account");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["adminWhatsappEnquiries"] });
    },
  });

  const updateAccountMutateRef = useRef(updateAccountMutation.mutate);
  updateAccountMutateRef.current = updateAccountMutation.mutate;

  const handleUpdateAccount = useCallback((enquiryId: string, account: string | null) => {
    updateAccountMutateRef.current({ enquiryId, account });
  }, []);

  const updateCategoryMutation = useMutation({
    mutationFn: (data: { enquiryId: string; category: string | null }) =>
      adminUpdateWhatsappEnquiry(data.enquiryId, { category: data.category }),
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: ["adminWhatsappEnquiries"] });
      const previousEnquiries = queryClient.getQueryData(["adminWhatsappEnquiries"]);
      queryClient.setQueryData(["adminWhatsappEnquiries"], (old: any) => {
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
        queryClient.setQueryData(["adminWhatsappEnquiries"], context.previousEnquiries);
      }
      toast.error(error?.response?.data?.message || "Failed to update category");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["adminWhatsappEnquiries"] });
    },
  });

  const updateCategoryMutateRef = useRef(updateCategoryMutation.mutate);
  updateCategoryMutateRef.current = updateCategoryMutation.mutate;

  const handleUpdateCategory = useCallback((enquiryId: string, category: string | null) => {
    updateCategoryMutateRef.current({ enquiryId, category });
  }, []);

  const columns = useMemo(() => AdminWhatsappEnquiryTableColumns(
    handleEditEnquiry,
    handleDeleteEnquiry,
    handleUpdateStatus,
    handleUpdateAccount,
    handleUpdateCategory
  ), [handleEditEnquiry, handleDeleteEnquiry, handleUpdateStatus, handleUpdateAccount, handleUpdateCategory]);

  return (
    <div className="p-2 sm:p-6 w-full max-w-[100vw] overflow-hidden">
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddEnquiry} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Whatsapp Enquiry
        </Button>
      </div>

      <CommonTable
        column={columns}
        columnsCount={columns.length}
        queryKey="adminWhatsappEnquiries"
        fetchApiFunction={fetchEnquiries}
      />

      {isModalOpen && (
        <WhatsappEnquiryModal 
          enquiry={selectedEnquiry} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default AdminWhatsappEnquiries;
