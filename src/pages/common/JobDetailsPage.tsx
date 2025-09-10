import dayjs from 'dayjs';
import { 
  X, 
  Briefcase, 
  Edit,
  Trash2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Loading from '@/pages/common/Loading';
import { Button } from '@/components/ui/button';
import type { AppDispatch } from '@/store/store';
import { deleteJob } from '@/utils/apis/adminJobApi';
import relativeTime from 'dayjs/plugin/relativeTime';
import { openEditJobForm } from '@/store/slices/jobSlice';
import InfoDisplay from '../../components/common/InfoDisplay';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import DataFetchingError from '../../components/common/DataFetchingError';
import type { FetchJobDetailsResponse } from '@/types/apiTypes/commonApiTypes';

dayjs.extend(relativeTime);

interface JobDetailsPageProps {
  jobId: string;
  onClose: () => void;
  fetchJobById: (jobId: string) => Promise<FetchJobDetailsResponse>;
}

const JobDetailsPage: React.FC<JobDetailsPageProps> = ({ 
  jobId,
  onClose,
fetchJobById,
 }) => {
  
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);

   const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchJobById(jobId),
    queryKey: ["job-detail", jobId],
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (!data) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-700 text-black dark:text-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 border border-black">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-black">
              <Briefcase className="h-8 w-8 " />
            </div>
            <h2 className="text-xl font-bold mb-2">Job Not Found</h2>
            <p className="mb-6">The job you're looking for doesn't exist.</p>
            <Button onClick={onClose} variant={"outline"}>
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if(isLoading) {
    return (
      <Loading />
    )
  }

  if(isError && error) {
    <DataFetchingError message='Data fetching error' />
  }

  const handleEdit = () => {
    dispatch(openEditJobForm(jobId));
    onClose();
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }
    setDeleting(true);
    try {
      const response = await deleteJob(jobId);
      if (response.success) {
        toast.success(response.message || 'Job deleted successfully!');
        queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });        
        onClose();
      } else {
        toast.error('Failed to delete job');
      }
    } catch {
      toast.error("Job deleting failed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-2xl max-w-4xl overflow-y-scroll h-screen border border-black max-h-[70%]">

        <div className="px-6 py-4 border-b border-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border border-black">
                <Briefcase className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">Job Details</h3>
            </div>
            <Button
              variant={"outline"}
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {data && (
          <>
           <InfoDisplay label='Company' value={data.companyName} />
           <InfoDisplay label='Designation' value={data.designation} />
           <InfoDisplay label='Industry' value={data.industry} />
           <InfoDisplay label='Nationality' value={data.nationality} />
           <InfoDisplay label='Salary' value={data.salary} />
           <InfoDisplay label='Vacancy' value={data.vacancy} />
           <InfoDisplay label='Skills' value={data.skills} />
           <InfoDisplay label='JobDescription' value={data.jobDescription} />
           <InfoDisplay label='Benifits' value={data.benifits} />
           <InfoDisplay label='Posted On' value={data.createdAt} isDate />
          </>
        )}

        <div className="px-6 py-4 border-t border-black flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleEdit}
            variant={"outline"}
            className="hover:bg-blue-500 hover:text-white cursor-pointer"
            disabled={deleting}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Job
          </Button>
          
          <Button
            onClick={handleDelete}
            variant="outline"
            className="hover:bg-red-500 hover:text-white cursor-pointer"
            disabled={deleting}
          >
            {deleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent mr-2" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default JobDetailsPage;