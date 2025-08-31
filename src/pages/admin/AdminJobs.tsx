import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Plus, Eye, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import dayjs from "dayjs";
import type { AppDispatch, RootState } from '@/store/store';
import { adminFetchAllJobs } from '@/utils/apis/adminApi';
import { deleteJob } from '@/utils/apis/jobApi';
import CommonTable from '@/components/common/CommonTable';
import { toggleAddJobForm, openEditJobForm, openViewDetailsModal, closeViewDetailsModal, removeJob } from '@/store/slices/jobSlice';
import type { AdminfetchAllJobsResponse } from '@/types/apiTypes/admin';
import { DataTableColumnHeader } from '@/components/table/DataTableColumnHeader';
import type { ColumnDef } from '@tanstack/react-table';
import AddJobForm from '@/components/admin/AddJobForm';
import EditJobForm from '@/components/admin/EditJobForm';
import JobDetailsModal from '@/components/admin/JobDetails';

interface AdminJobsProps {
  showButton?: boolean;
}

const AdminJobs: React.FC<AdminJobsProps> = ({ showButton = true }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAddJobFormOpen, isEditJobFormOpen, isViewDetailsModalOpen, viewingJobId, jobs } =
    useSelector((state: RootState) => state.job);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

  const handleViewDetails = (jobId: string) => {
    dispatch(openViewDetailsModal(jobId));
  };

  const handleEdit = (jobId: string) => {
    dispatch(openEditJobForm(jobId));
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    setDeletingJobId(jobId);

    try {
      const response = await deleteJob(jobId);

      if (response.success) {
        toast.success(response.message || 'Job deleted successfully!');
        dispatch(removeJob(jobId));
      } else {
        toast.error('Failed to delete job');
      }
    } catch (error: any) {
      console.error('Delete job error:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to delete job';
      toast.error(errorMessage);
    } finally {
      setDeletingJobId(null);
    }
  };

  // Table columns
  const AdminJobsTableColumns: ColumnDef<AdminfetchAllJobsResponse>[] = [
    {
      accessorKey: "companyName",
      header: ({ column }) => (<DataTableColumnHeader column={column} title="Company Name" />),
      cell: ({ row }) => (
        <div className="font-medium text-blue-400">{row.original.companyName}</div>
      )
    },
    {
      accessorKey: "designation",
      header: ({ column }) => (<DataTableColumnHeader column={column} title="Position" />),
      cell: ({ row }) => (
        <div className="font-medium text-blue-400">{row.original.designation}</div>
      )
    },
    {
      accessorKey: "vacancy",
      header: ({ column }) => (<DataTableColumnHeader column={column} title="Openings" />),
      cell: ({ row }) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-700">
          {row.original.vacancy} positions
        </span>
      )
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Posted On" />
      ),
      cell: ({ row }) => {
        const date = dayjs(row.original.createdAt).format("DD MMM YYYY");
        return <span className="text-blue-400">{date}</span>;
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original._id)}
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
        </div>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Job Management
              </h1>
            </div>
            
            {showButton && (
              <Button 
                onClick={() => dispatch(toggleAddJobForm())}
                className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
              >
                <Plus className="h-5 w-5" />
                Add New Job
              </Button>
            )}
          </div>
        </div>

        {/* CommonTable */}
        <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700">
         <CommonTable<AdminfetchAllJobsResponse>
  fetchApiFunction={adminFetchAllJobs}
  queryKey="admin-jobs"
  column={AdminJobsTableColumns}   // ✅ use "column" (matches your CommonTable props)
  columnsCount={5}
  pageSize={10}
/>

        </div>

        {/* Modals */}
        {isAddJobFormOpen && <AddJobForm />}
        {isEditJobFormOpen && <EditJobForm />}
        {isViewDetailsModalOpen && viewingJobId && (
          <JobDetailsModal 
            jobId={viewingJobId} 
            onClose={() => dispatch(closeViewDetailsModal())} 
          />
        )}
      </div>
    </div>
  );
};

export default AdminJobs;
