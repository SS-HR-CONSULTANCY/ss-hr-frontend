import dayjs from "dayjs";
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import JobDetails from "@/pages/common/JobDetailsPage";
import { useDispatch, useSelector } from 'react-redux';
import type { ColumnDef } from '@tanstack/react-table';
import AddJobForm from '@/components/admin/AddJobForm';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import EditJobForm from '@/components/admin/EditJobForm';
import CommonTable from '@/components/common/CommonTable';
import type { AppDispatch, RootState } from '@/store/store';
import ConfirmDialog from "@/components/common/ConfirmDialog";
import type { AdminfetchAllJobsResponse } from '@/types/apiTypes/adminApiTypes';
import { DataTableColumnHeader } from '@/components/table/DataTableColumnHeader';
import { adminFetchAllJobs, adminGetJobById, deleteJob } from '@/utils/apis/adminJobApi';
import { toggleAddJobForm, openEditJobForm, openViewDetailsModal, closeViewDetailsModal } from '@/store/slices/jobSlice';

interface AdminJobsProps {
  showButton?: boolean;
}

const AdminJobs: React.FC<AdminJobsProps> = ({ showButton = true }) => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const { isAddJobFormOpen, isEditJobFormOpen, isViewDetailsModalOpen, viewingJobId } = useSelector((state: RootState) => state.job);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

  const handleViewDetails = (jobId: string) => {
    dispatch(openViewDetailsModal(jobId));
  };

  const handleEdit = (jobId: string) => {
    dispatch(openEditJobForm(jobId));
  };

  const handleDelete = async (jobId: string) => {
    setDeletingJobId(jobId);
    try {
      const response = await deleteJob(jobId);

      if (response.success) {
        toast.success(response.message || 'Job deleted successfully!');

        queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
      } else {
        toast.error('Failed to delete job');
      }
    } catch {
      toast.error("Error");
    } finally {
      setDeletingJobId(null);
    }
  };

  const AdminJobsTableColumns: ColumnDef<AdminfetchAllJobsResponse>[] = [
    {
      accessorKey: "companyName",
      header: ({ column }) => (<DataTableColumnHeader column={column} title="Company Name" />),
    },
    {
      accessorKey: "designation",
      header: ({ column }) => (<DataTableColumnHeader column={column} title="Position" />),
    },
    {
      accessorKey: "vacancy",
      header: ({ column }) => (<DataTableColumnHeader column={column} title="Openings" />),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Posted On" />
      ),
      cell: ({ row }) => {
        const date = dayjs(row.original.createdAt).format("DD MMM YYYY");
        return <span>{date}</span>;
      },
    },
    {
      accessorKey: "actions",
      header: "Actions",
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(row.original._id)}
            className="h-8 w-8 p-0 hover:bg-blue-900/30 hover:text-blue-400 transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row.original._id)}
            className="h-8 w-8 p-0 hover:bg-blue-900/30 hover:text-blue-400 transition-colors"
            title="Edit Job"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <ConfirmDialog
            trigger={
              <Button
                variant="ghost"
                size="sm"
                disabled={deletingJobId === row.original._id}
                className="h-8 w-8 p-0 hover:bg-red-900/30 hover:text-red-400 transition-colors"
                title="Delete Job"
              >
                {deletingJobId === row.original._id ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent"></div>
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            }
            title="Are you sure you want to delete this job?"
            description="This action cannot be undone."
            confirmText="Delete"
            onConfirm={() => handleDelete(row.original._id)}
          />
        </div>
      )
    },
  ];

  return (
    <div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Job Management</h1>
          <p className="">Manage all jobs from the companies</p>
        </div>
        {showButton && (
          <Button
            onClick={() => dispatch(toggleAddJobForm())}
            variant={"outline"}
          >
            <Plus className="h-5 w-5" />
            Add New Job
          </Button>
        )}
      </div>

      <CommonTable<AdminfetchAllJobsResponse>
        fetchApiFunction={adminFetchAllJobs}
        queryKey="admin-jobs"
        column={AdminJobsTableColumns}
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
    </div>
  );
};

export default AdminJobs;