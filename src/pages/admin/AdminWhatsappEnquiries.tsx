import React, { useState, useCallback, useMemo } from "react";
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
    mutationFn: (data: { enquiryId: string; status: "pending" | "contacted" | "under_processing" | "delivered" }) => 
      adminUpdateWhatsappEnquiryStatus(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Enquiry status updated successfully");
        queryClient.invalidateQueries({ queryKey: ["adminWhatsappEnquiries"] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
  });

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

  const handleUpdateStatus = useCallback((enquiryId: string, status: "pending" | "contacted" | "under_processing" | "delivered") => {
    updateStatusMutation.mutate({ enquiryId, status });
  }, [updateStatusMutation]);

  const updateAccountMutation = useMutation({
    mutationFn: (data: { enquiryId: string; account: string | null }) =>
      adminUpdateWhatsappEnquiry(data.enquiryId, { account: data.account }),
    onSuccess: () => {
      toast.success("Account updated successfully");
      queryClient.invalidateQueries({ queryKey: ["adminWhatsappEnquiries"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update account");
    },
  });

  const handleUpdateAccount = useCallback((enquiryId: string, account: string | null) => {
    updateAccountMutation.mutate({ enquiryId, account });
  }, [updateAccountMutation]);

  const columns = useMemo(() => AdminWhatsappEnquiryTableColumns(
    handleEditEnquiry,
    handleDeleteEnquiry,
    handleUpdateStatus,
    handleUpdateAccount
  ), [handleEditEnquiry, handleDeleteEnquiry, handleUpdateStatus, handleUpdateAccount]);

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
