import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminJobs } from "@/hooks/useAdminJobs";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "@/components/common/CommonTable";
import type { AppDispatch, RootState } from "@/store/store";
import { toggleAddJobForm } from "@/store/slices/jobSlice";
import { adminFetchAllJobs } from "@/utils/apis/adminJobApi";
import AddJobForm from "@/components/admin/adminJob/AddJobForm";
import TablePageHeader from "@/components/common/TablePageHeader";
import EditJobForm from "@/components/admin/adminJob/EditJobForm";
import type { AdminfetchAllJobsResponse } from "@/types/apiTypes/adminApiTypes";
import { AdminJobsTableColumns } from "@/components/table/tableColumns/AdminJobTableColumn";

const AdminJobsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { handleDelete, handleEdit, handleViewDetails } = useAdminJobs();

  const { isAddJobFormOpen, isEditJobFormOpen } = useSelector(
    (state: RootState) => state.job,
  );

  const columns = AdminJobsTableColumns(
    handleViewDetails,
    handleEdit,
    handleDelete,
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
    </>
  );
};

export default AdminJobsPage;
