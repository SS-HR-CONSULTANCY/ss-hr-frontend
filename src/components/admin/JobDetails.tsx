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

// Extend dayjs with relative time plugin
dayjs.extend(relativeTime);

interface JobDetailsModalProps {
  jobId: string;
  onClose: () => void;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ jobId, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs } = useSelector((state: RootState) => state.job);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Find the job by ID
  const job = jobs.find(j => j._id === jobId);

  if (!job) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 border border-gray-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Job Not Found</h2>
            <p className="text-gray-400 mb-6">The job you're looking for doesn't exist.</p>
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-600 bg-gradient-to-r from-gray-700 to-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center border border-blue-700">
                <Briefcase className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Job Details</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-600/50 transition-colors text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Main Job Information */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Company & Position */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-xl">
                  <div className="w-12 h-12 bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{job.companyName}</h2>
                    <p className="text-gray-400">Company</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-xl">
                  <div className="w-12 h-12 bg-purple-900/30 rounded-xl flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{job.designation}</h3>
                    <p className="text-gray-400">Position</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-xl">
                  <div className="w-12 h-12 bg-green-900/30 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{job.vacancy}</h3>
                    <p className="text-gray-400">Open Positions</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <Card className="bg-gray-700/30 border-gray-600 p-4">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Calendar className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">
                      {dayjs().diff(dayjs(job.createdAt), 'day')}
                    </p>
                    <p className="text-sm text-gray-400">Days Active</p>
                  </div>
                </Card>

                <Card className="bg-gray-700/30 border-gray-600 p-4">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <User className="h-5 w-5 text-green-400" />
                    </div>
                    <p className="text-2xl font-bold text-white">0</p>
                    <p className="text-sm text-gray-400">Applications</p>
                  </div>
                </Card>
              </div>
            </div>

            {/* Timeline */}
            <Card className="bg-gray-700/30 border-gray-600 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-400" />
                Job Timeline
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-white">Job Created</h4>
                      <span className="text-sm text-gray-400">
                        {dayjs(job.createdAt).format('MMM DD, YYYY • HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {dayjs(job.createdAt).fromNow()}
                    </p>
                  </div>
                </div>

                {job.updatedAt !== job.createdAt && (
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white">Last Updated</h4>
                        <span className="text-sm text-gray-400">
                          {dayjs(job.updatedAt).format('MMM DD, YYYY • HH:mm')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {dayjs(job.updatedAt).fromNow()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Job Information */}
            <Card className="bg-gray-700/30 border-gray-600 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-blue-400" />
                Job Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-gray-600/30 rounded-lg">
                  <span className="text-gray-400">Job ID</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono text-sm">{job._id.slice(-8)}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyJobId}
                      className="h-6 w-6 p-0 hover:bg-gray-500/30"
                      title="Copy full Job ID"
                    >
                      {copied ? (
                        <CheckCircle className="h-3 w-3 text-green-400" />
                      ) : (
                        <Copy className="h-3 w-3 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-600/30 rounded-lg">
                  <span className="text-gray-400">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300 border border-green-700">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-600/30 rounded-lg">
                  <span className="text-gray-400">Posted</span>
                  <span className="text-white text-sm">
                    {dayjs(job.createdAt).format('MMM DD, YYYY')}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-600/30 rounded-lg">
                  <span className="text-gray-400">Category</span>
                  <span className="text-white text-sm">General</span>
                </div>
              </div>
            </Card>

            {/* Application Analytics Placeholder */}
            <Card className="bg-gray-700/30 border-gray-600 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-400" />
                Application Analytics
              </h3>
              
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-gray-600/50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-400 text-sm mb-2">Application tracking coming soon</p>
                <p className="text-xs text-gray-500">
                  View and manage applications when the feature is implemented
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="px-6 py-4 bg-gray-700 border-t border-gray-600 flex flex-col sm:flex-row gap-3">
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
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white"
            disabled={deleting}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Contact
          </Button>
          
          <Button
            onClick={handleDelete}
            variant="outline"
            className="flex-1 border-red-600 text-red-400 hover:bg-red-900/20 hover:text-red-300"
            disabled={deleting}
          >
            {deleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent mr-2" />
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

export default JobDetailsModal;