import { Plus } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import JobDetails from "@/pages/common/JobDetailsPage";
import { useDispatch, useSelector } from "react-redux";
import AddJobForm from "@/components/admin/AddJobForm";
import { useQueryClient } from "@tanstack/react-query";
import EditJobForm from "@/components/admin/EditJobForm";
import CommonTable from "@/components/common/CommonTable";
import { JobHandlers } from "@/utils/helpers/jobHelpers";
import type { AppDispatch, RootState } from "@/store/store";
import TablePageHeader from "@/components/common/TablePageHeader";
import { adminFetchAllJobs, adminGetJobById } from "@/utils/apis/adminJobApi";
import type { AdminfetchAllJobsResponse } from "@/types/apiTypes/adminApiTypes";
import {
  toggleAddJobForm,
  closeViewDetailsModal,
} from "@/store/slices/jobSlice";
import { AdminJobsTableColumns } from "@/components/table/tableColumns/AdminJobTableColumn";

const AdminJobsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const { handleViewDetails, handleEdit, handleDelete } = JobHandlers(
    dispatch,
    queryClient,
    setDeletingJobId,
  );
  const {
    isAddJobFormOpen,
    isEditJobFormOpen,
    isViewDetailsModalOpen,
    viewingJobId,
  } = useSelector((state: RootState) => state.job);

  const columns = AdminJobsTableColumns(
    handleViewDetails,
    handleEdit,
    handleDelete,
    deletingJobId,
  );

  return (
    <>
      <TablePageHeader
        title="Job Management"
        subtitle="Manage all jobs from the companies"
        actionButton={
          <Button
            onClick={() => dispatch(toggleAddJobForm())}
            variant="outline"
          >
            <Plus className="h-5 w-5" />
            Add New Job
          </Button>
        }
      />

      <CommonTable<AdminfetchAllJobsResponse>
        fetchApiFunction={adminFetchAllJobs}
        queryKey="admin-jobs"
        column={columns}
        columnsCount={5}
        pageSize={10}
      />

      {isAddJobFormOpen && <AddJobForm />}
      {isEditJobFormOpen && <EditJobForm />}
      {isViewDetailsModalOpen && viewingJobId && (
        <JobDetails
          jobId={viewingJobId}
          onClose={() => dispatch(closeViewDetailsModal())}
          fetchJobById={() => adminGetJobById(viewingJobId)}
        />
      )}
    </>
  );
};

export default AdminJobsPage;
