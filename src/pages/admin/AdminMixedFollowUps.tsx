import React, { useState, useMemo, useCallback, useRef } from "react";
import CommonTable from "@/components/common/CommonTable";
import { AdminMixedFollowUpTableColumns } from "@/components/table/tableColumns/AdminMixedFollowUpTableColumns";
import { 
  adminFetchAllEnquiries, 
  adminDeleteEnquiry, 
  adminUpdateEnquiryStatus, 
  adminUpdateEnquiryCategory, 
  adminUpdateEnquiryComment,
  adminUpdateEnquiryReminder
} from "@/utils/apis/adminEnquiryApi";
import { 
  adminFetchAllWhatsappEnquiries, 
  adminDeleteWhatsappEnquiry, 
  adminUpdateWhatsappEnquiryStatus, 
  adminUpdateWhatsappEnquiry, 
  adminUpdateWhatsappEnquiryComment,
  adminUpdateWhatsappEnquiryReminder
} from "@/utils/apis/adminWhatsappEnquiryApi";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { openViewEnquiryDetails } from "@/store/slices/enquirySlice";
import EnquiryDetailsModal from "@/components/admin/adminEnquiry/EnquiryDetailsModal";
import WhatsappEnquiryModal from "@/components/admin/whatsappEnquiry/WhatsappEnquiryModal";

const AdminMixedFollowUps: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isViewEnquiryDetailsOpen = useSelector((state: RootState) => state.enquiry.isViewEnquiryDetailsOpen);
  const queryClient = useQueryClient();
  
  const [isWaModalOpen, setIsWaModalOpen] = useState(false);
  const [selectedWaEnquiry, setSelectedWaEnquiry] = useState<any | null>(null);

  const fetchMixedEnquiries = async (params?: any) => {
    try {
      const [webRes, waRes] = await Promise.all([
        adminFetchAllEnquiries({ 
          ...params, 
          pagination: { ...params?.pagination, page: 1, limit: 1000, status: "need_follow_up" } 
        }),
        adminFetchAllWhatsappEnquiries({ 
          ...params, 
          pagination: { ...params?.pagination, page: 1, limit: 1000, status: "need_follow_up" } 
        })
      ]);

      const webData = (webRes?.data || []).map(item => ({ ...item, enquiryType: 'Website', _id: item._id }));
      const waData = (waRes?.data || []).map((item: any) => ({ 
        ...item, 
        enquiryType: 'WhatsApp',
        createdAt: item.date || item.createdAt // Normalize date
      }));

      const merged = [...webData, ...waData];
      
      // Sort by reminder date ascending, then fallback to createdAt descending
      merged.sort((a, b) => {
        if (a.reminder && b.reminder) {
          return new Date(a.reminder).getTime() - new Date(b.reminder).getTime();
        } else if (a.reminder) {
          return -1;
        } else if (b.reminder) {
          return 1;
        } else {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });

      // Local pagination
      const page = params?.pagination?.page || 1;
      const limit = params?.pagination?.limit || 10;
      const startIndex = (page - 1) * limit;
      const paginatedItems = merged.slice(startIndex, startIndex + limit);

      return {
        success: true,
        data: paginatedItems,
        totalPages: Math.ceil(merged.length / limit),
        total: merged.length,
        page,
        limit
      };
    } catch (error) {
      console.error("Failed to fetch mixed enquiries:", error);
      throw error;
    }
  };

  const deleteWebMutation = useMutation({
    mutationFn: (enquiryId: string) => adminDeleteEnquiry(enquiryId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Enquiry deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["adminMixedFollowUps"] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete enquiry");
    },
  });

  const deleteWaMutation = useMutation({
    mutationFn: (enquiryId: string) => adminDeleteWhatsappEnquiry(enquiryId),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Enquiry deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["adminMixedFollowUps"] });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete enquiry");
    },
  });

  const updateWebStatusMutation = useMutation({
    mutationFn: (data: { enquiryId: string; status: any }) => adminUpdateEnquiryStatus(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminMixedFollowUps"] }),
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to update status"),
  });

  const updateWaStatusMutation = useMutation({
    mutationFn: (data: { enquiryId: string; status: any }) => adminUpdateWhatsappEnquiryStatus(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminMixedFollowUps"] }),
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to update status"),
  });

  const updateWebCategoryMutation = useMutation({
    mutationFn: (data: { enquiryId: string; category: string | null }) => adminUpdateEnquiryCategory(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminMixedFollowUps"] }),
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to update category"),
  });

  const updateWaCategoryMutation = useMutation({
    mutationFn: (data: { enquiryId: string; category: string | null }) => adminUpdateWhatsappEnquiry(data.enquiryId, { category: data.category }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminMixedFollowUps"] }),
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to update category"),
  });

  const updateWebCommentMutation = useMutation({
    mutationFn: (data: { enquiryId: string; comment: string | null }) => adminUpdateEnquiryComment(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminMixedFollowUps"] }),
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to update comment"),
  });

  const updateWaCommentMutation = useMutation({
    mutationFn: (data: { enquiryId: string; comment: string | null }) => adminUpdateWhatsappEnquiryComment(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminMixedFollowUps"] }),
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to update comment"),
  });

  const updateWebReminderMutation = useMutation({
    mutationFn: (data: { enquiryId: string; reminder: string | null }) => adminUpdateEnquiryReminder(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminMixedFollowUps"] }),
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to update reminder"),
  });

  const updateWaReminderMutation = useMutation({
    mutationFn: (data: { enquiryId: string; reminder: string | null }) => adminUpdateWhatsappEnquiryReminder(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["adminMixedFollowUps"] }),
    onError: (error: any) => toast.error(error?.response?.data?.message || "Failed to update reminder"),
  });

  // Handlers
  const handleViewWebEnquiry = useCallback((enquiryId: string) => {
    dispatch(openViewEnquiryDetails(enquiryId));
  }, [dispatch]);

  const handleEditWhatsappEnquiry = useCallback((enquiry: any) => {
    setSelectedWaEnquiry(enquiry);
    setIsWaModalOpen(true);
  }, []);

  const handleDeleteEnquiry = useCallback((enquiry: any) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      if (enquiry.enquiryType === 'Website') deleteWebMutation.mutate(enquiry._id);
      else deleteWaMutation.mutate(enquiry._id);
    }
  }, [deleteWebMutation, deleteWaMutation]);

  const handleUpdateStatus = useCallback((enquiry: any, status: any) => {
    if (enquiry.enquiryType === 'Website') updateWebStatusMutation.mutate({ enquiryId: enquiry._id, status });
    else updateWaStatusMutation.mutate({ enquiryId: enquiry._id, status });
  }, [updateWebStatusMutation, updateWaStatusMutation]);

  const handleUpdateCategory = useCallback((enquiry: any, category: string | null) => {
    if (enquiry.enquiryType === 'Website') updateWebCategoryMutation.mutate({ enquiryId: enquiry._id, category });
    else updateWaCategoryMutation.mutate({ enquiryId: enquiry._id, category });
  }, [updateWebCategoryMutation, updateWaCategoryMutation]);

  const handleUpdateComment = useCallback((enquiry: any, comment: string | null) => {
    if (enquiry.enquiryType === 'Website') updateWebCommentMutation.mutate({ enquiryId: enquiry._id, comment });
    else updateWaCommentMutation.mutate({ enquiryId: enquiry._id, comment });
  }, [updateWebCommentMutation, updateWaCommentMutation]);

  const handleUpdateReminder = useCallback((enquiry: any, reminder: string | null) => {
    if (enquiry.enquiryType === 'Website') updateWebReminderMutation.mutate({ enquiryId: enquiry._id, reminder });
    else updateWaReminderMutation.mutate({ enquiryId: enquiry._id, reminder });
  }, [updateWebReminderMutation, updateWaReminderMutation]);

  const columns = useMemo(() => AdminMixedFollowUpTableColumns(
    handleViewWebEnquiry,
    handleEditWhatsappEnquiry,
    handleDeleteEnquiry,
    handleUpdateStatus,
    handleUpdateCategory,
    handleUpdateComment,
    handleUpdateReminder
  ), [
    handleViewWebEnquiry, 
    handleEditWhatsappEnquiry, 
    handleDeleteEnquiry, 
    handleUpdateStatus, 
    handleUpdateCategory, 
    handleUpdateComment,
    handleUpdateReminder
  ]);

  return (
    <div className="w-full h-full overflow-hidden">
      <CommonTable
        column={columns}
        columnsCount={columns.length}
        queryKey="adminMixedFollowUps"
        fetchApiFunction={fetchMixedEnquiries as any}
        showSearchInput={false}
      />

      {isViewEnquiryDetailsOpen && <EnquiryDetailsModal />}
      
      {isWaModalOpen && (
        <WhatsappEnquiryModal 
          enquiry={selectedWaEnquiry} 
          onClose={() => setIsWaModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default AdminMixedFollowUps;
