import React from "react";
import CommonTable from "@/components/common/CommonTable";
import { AdminEnquiryTableColumns } from "@/components/table/tableColumns/AdminEnquiryTableColumns";
import { adminFetchAllEnquiries } from "@/utils/apis/adminEnquiryApi";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { openViewEnquiryDetails } from "@/store/slices/enquirySlice";
import EnquiryDetailsModal from "@/components/admin/adminEnquiry/EnquiryDetailsModal";

const AdminEnquiries: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isViewEnquiryDetailsOpen = useSelector((state: RootState) => state.enquiry.isViewEnquiryDetailsOpen);

  const fetchEnquiries = async (params?: any) => {
    return await adminFetchAllEnquiries(params);
  };

  const handleViewEnquiry = (enquiryId: string) => {
    dispatch(openViewEnquiryDetails(enquiryId));
  };

  const columns = AdminEnquiryTableColumns(handleViewEnquiry);

  return (
    <div className="p-2 sm:p-6 w-full max-w-[100vw] overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-gray-200">Enquiries</h1>
          <p className="text-gray-500 text-sm mt-1">Manage contact form queries and submissions</p>
        </div>
      </div>

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
