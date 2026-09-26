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

  const FOLLOW_UP_STATUSES = [
    "need_follow_up",
    "processing_application",
    "completed",
  ];

  const fetchMixedEnquiries = async (params?: any) => {
    try {
      const fetchesPerStatus = FOLLOW_UP_STATUSES.flatMap((status) => [
        adminFetchAllEnquiries({
          ...params,
          pagination: { ...params?.pagination, page: 1, limit: 1000, status },
        }),
        adminFetchAllWhatsappEnquiries({
          ...params,
          pagination: { ...params?.pagination, page: 1, limit: 1000, status },
        }),
      ]);

      const results = await Promise.all(fetchesPerStatus);

      // Odd indices = WhatsApp, even indices = Website
      const webData: any[] = [];
      const waData: any[] = [];
      results.forEach((res, idx) => {
        if (idx % 2 === 0) {
          (res?.data || []).forEach((item: any) =>
            webData.push({ ...item, enquiryType: "Website", _id: item._id })
          );
        } else {
          (res?.data || []).forEach((item: any) =>
            waData.push({
              ...item,
              enquiryType: "WhatsApp",
              createdAt: item.date || item.createdAt,
            })
          );
        }
      });

      const merged = [...webData, ...waData];
      
      // Sort by createdAt descending
      merged.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      // Client-side search filtering
      const searchQuery = params?.pagination?.searchQuery?.trim().toLowerCase();
      const filtered = searchQuery
        ? merged.filter((item) => {
            return (
              item.name?.toLowerCase().includes(searchQuery) ||
              item.phone?.toLowerCase().includes(searchQuery) ||
              item.email?.toLowerCase().includes(searchQuery) ||
              item.message?.toLowerCase().includes(searchQuery) ||
              item.enquiryType?.toLowerCase().includes(searchQuery)
            );
          })
        : merged;

      // Local pagination
      const page = params?.pagination?.page || 1;
      const limit = params?.pagination?.limit || 10;
      const startIndex = (page - 1) * limit;
      const paginatedItems = filtered.slice(startIndex, startIndex + limit);

      return {
        success: true,
        data: paginatedItems,
        totalPages: Math.ceil(filtered.length / limit),
        total: filtered.length,
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

  // Stable refs for mutations to avoid memoized columns going stale
  const deleteWebMutateRef = useRef(deleteWebMutation.mutate);
  deleteWebMutateRef.current = deleteWebMutation.mutate;
  const deleteWaMutateRef = useRef(deleteWaMutation.mutate);
  deleteWaMutateRef.current = deleteWaMutation.mutate;

  const updateWebStatusMutateRef = useRef(updateWebStatusMutation.mutate);
  updateWebStatusMutateRef.current = updateWebStatusMutation.mutate;
  const updateWaStatusMutateRef = useRef(updateWaStatusMutation.mutate);
  updateWaStatusMutateRef.current = updateWaStatusMutation.mutate;

  const updateWebCategoryMutateRef = useRef(updateWebCategoryMutation.mutate);
  updateWebCategoryMutateRef.current = updateWebCategoryMutation.mutate;
  const updateWaCategoryMutateRef = useRef(updateWaCategoryMutation.mutate);
  updateWaCategoryMutateRef.current = updateWaCategoryMutation.mutate;

  const updateWebCommentMutateRef = useRef(updateWebCommentMutation.mutate);
  updateWebCommentMutateRef.current = updateWebCommentMutation.mutate;
  const updateWaCommentMutateRef = useRef(updateWaCommentMutation.mutate);
  updateWaCommentMutateRef.current = updateWaCommentMutation.mutate;

  const updateWebReminderMutateRef = useRef(updateWebReminderMutation.mutate);
  updateWebReminderMutateRef.current = updateWebReminderMutation.mutate;
  const updateWaReminderMutateRef = useRef(updateWaReminderMutation.mutate);
  updateWaReminderMutateRef.current = updateWaReminderMutation.mutate;

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
      if (enquiry.enquiryType === 'Website') deleteWebMutateRef.current(enquiry._id);
      else deleteWaMutateRef.current(enquiry._id);
    }
  }, []);

  const handleUpdateStatus = useCallback((enquiry: any, status: any) => {
    if (enquiry.enquiryType === 'Website') updateWebStatusMutateRef.current({ enquiryId: enquiry._id, status });
    else updateWaStatusMutateRef.current({ enquiryId: enquiry._id, status });
  }, []);

  const handleUpdateCategory = useCallback((enquiry: any, category: string | null) => {
    if (enquiry.enquiryType === 'Website') updateWebCategoryMutateRef.current({ enquiryId: enquiry._id, category });
    else updateWaCategoryMutateRef.current({ enquiryId: enquiry._id, category });
  }, []);

  const handleUpdateComment = useCallback((enquiry: any, comment: string | null) => {
    if (enquiry.enquiryType === 'Website') updateWebCommentMutateRef.current({ enquiryId: enquiry._id, comment });
    else updateWaCommentMutateRef.current({ enquiryId: enquiry._id, comment });
  }, []);

  const handleUpdateReminder = useCallback((enquiry: any, reminder: string | null) => {
    if (enquiry.enquiryType === 'Website') updateWebReminderMutateRef.current({ enquiryId: enquiry._id, reminder });
    else updateWaReminderMutateRef.current({ enquiryId: enquiry._id, reminder });
  }, []);

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
        showSearchInput={true}
        searchPlaceholder="Search by name, phone, email..."
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
