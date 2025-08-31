import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  X, 
  Building2, 
  Briefcase, 
  Users, 
  Calendar, 
  Clock,
  Edit,
  Trash2,
  ExternalLink,
  User,
  Copy,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { AppDispatch, RootState } from '@/store/store';
import { openEditJobForm, removeJob } from '@/store/slices/jobSlice';
import { deleteJob } from '@/utils/apis/jobApi';
import { useQueryClient } from '@tanstack/react-query';

// Extend dayjs with relative time plugin
dayjs.extend(relativeTime);

interface JobDetailsProps {
  jobId: string;
  onClose: () => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ jobId, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const { jobs } = useSelector((state: RootState) => state.job);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Find the job by ID
  const job = jobs.find(j => j._id === jobId);

  if (!job) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 border border-black">
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-black">
              <Briefcase className="h-8 w-8 text-black" />
            </div>
            <h2 className="text-xl font-bold text-black mb-2">Job Not Found</h2>
            <p className="text-black mb-6">The job you're looking for doesn't exist.</p>
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white">
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    dispatch(openEditJobForm(job._id));
    onClose(); // Close details modal when opening edit
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    
    try {
      const response = await deleteJob(job._id);
      
      if (response.success) {
        toast.success(response.message || 'Job deleted successfully!');
        dispatch(removeJob(job._id));
        
        // Invalidate React Query cache to refresh table
        queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
        
        onClose();
      } else {
        toast.error('Failed to delete job');
      }
    } catch (error: any) {
      console.error('Delete job error:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to delete job';
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const handleCopyJobId = async () => {
    try {
      await navigator.clipboard.writeText(job._id);
      setCopied(true);
      toast.success('Job ID copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy Job ID');
    }
  };

  const handleContactCompany = () => {
    const email = `hr@${job.companyName.toLowerCase().replace(/\s+/g, '')}.com`;
    const subject = `Job Inquiry: ${job.designation}`;
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    window.open(mailtoUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-black">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-black">
                <Briefcase className="h-5 w-5 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black">Job Details</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-white transition-colors text-black hover:text-black"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto bg-white">
          <div className="p-6 space-y-6">
            {/* Main Job Information */}
            <div className="grid grid-cols-1 gap-6">
              {/* Company & Position */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-6 bg-white border border-black rounded-xl">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-black">
                    <Building2 className="h-8 w-8 text-black" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-black">{job.companyName}</h2>
                    <p className="text-black text-lg">Company</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-6 bg-white border border-black rounded-xl">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-black">
                    <Briefcase className="h-8 w-8 text-black" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-black">{job.designation}</h3>
                    <p className="text-black text-lg">Position</p>
                  </div>
                </div>

                {job.vacancy && (
                  <div className="flex items-center gap-4 p-6 bg-white border border-black rounded-xl">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-black">
                      <Users className="h-8 w-8 text-black" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-black">{job.vacancy}</h3>
                      <p className="text-black text-lg">Open Positions</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Job Information Summary */}
            <Card className="bg-white border-black p-6">
              <h3 className="text-lg font-semibold text-black mb-4 flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-black" />
                Job Summary
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-white border border-black rounded-lg">
                  <span className="text-black font-medium">Company</span>
                  <span className="text-black">{job.companyName}</span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white border border-black rounded-lg">
                  <span className="text-black font-medium">Position</span>
                  <span className="text-black">{job.designation}</span>
                </div>

                {job.vacancy && (
                  <div className="flex items-center justify-between p-4 bg-white border border-black rounded-lg">
                    <span className="text-black font-medium">Vacancies</span>
                    <span className="text-black font-medium">{job.vacancy} positions</span>
                  </div>
                )}

                <div className="flex items-center justify-between p-4 bg-white border border-black rounded-lg">
                  <span className="text-black font-medium">Job ID</span>
                  <div className="flex items-center gap-2">
                    <span className="text-black font-mono text-sm">{job._id.slice(-8)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyJobId}
                      className="h-6 w-6 p-0 hover:bg-white"
                      title="Copy full Job ID"
                    >
                      {copied ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3 text-black" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="px-6 py-4 bg-white border-t border-black flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleEdit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={deleting}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Job
          </Button>
          
          <Button
            onClick={handleContactCompany}
            variant="outline"
            className="flex-1 border-black text-black hover:bg-white hover:text-black"
            disabled={deleting}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Contact
          </Button>
          
          <Button
            onClick={handleDelete}
            variant="outline"
            className="flex-1 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
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

export default JobDetails;