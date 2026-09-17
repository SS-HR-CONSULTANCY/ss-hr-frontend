import React from "react";
import CommonTable from "@/components/common/CommonTable";
import { AdminEnquiryTableColumns } from "@/components/table/tableColumns/AdminEnquiryTableColumns";
import { adminFetchAllEnquiries, adminDeleteEnquiry } from "@/utils/apis/adminEnquiryApi";
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

  const fetchEnquiries = async (params?: any) => {
    return await adminFetchAllEnquiries(params);
  };

  const handleViewEnquiry = (enquiryId: string) => {
    dispatch(openViewEnquiryDetails(enquiryId));
  };

  const handleDeleteEnquiry = (enquiryId: string) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      deleteMutation.mutate(enquiryId);
    }
  };

  const columns = AdminEnquiryTableColumns(handleViewEnquiry, handleDeleteEnquiry);

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
