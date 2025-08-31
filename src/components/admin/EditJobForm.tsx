import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Building2, Briefcase, Users, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import type { AppDispatch, RootState } from '@/store/store';
import { closeEditJobForm, updateJob } from '@/store/slices/jobSlice';
import { updateJob as updateJobApi } from '@/utils/apis/jobApi';

interface EditJobFormData {
  companyName: string;
  designation: string;
  vacancy: number;
}

const EditJobForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedJobId, jobs } = useSelector((state: RootState) => state.job);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<EditJobFormData>({
    companyName: '',
    designation: '',
    vacancy: 1
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EditJobFormData, string>>>({});

  // Find the job being edited
  const currentJob = jobs.find(job => job._id === selectedJobId);

  useEffect(() => {
    if (currentJob) {
      setFormData({
        companyName: currentJob.companyName,
        designation: currentJob.designation,
        vacancy: currentJob.vacancy
      });
    }
  }, [currentJob]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EditJobFormData, string>> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.designation.trim()) {
      newErrors.designation = 'Designation is required';
    }

    if (!formData.vacancy || formData.vacancy < 1) {
      newErrors.vacancy = 'Vacancy must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof EditJobFormData, value: string | number) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'vacancy' ? Number(value) : value 
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !selectedJobId) return;

    setLoading(true);

    try {
      const response = await updateJobApi(selectedJobId, formData);
      
      if (response.success) {
        toast.success(response.message || 'Job updated successfully!');
        dispatch(updateJob(response.job));
        dispatch(closeEditJobForm());
      } else {
        toast.error('Failed to update job');
      }
    } catch (error: any) {
      console.error('Update job error:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to update job';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(closeEditJobForm());
  };

  if (!currentJob) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-600 bg-gradient-to-r from-gray-700 to-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center border border-blue-700">
                <Briefcase className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Edit Job</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0 hover:bg-gray-600/50 transition-colors text-gray-400 hover:text-white">
            
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Company Name */}
          <div className="space-y-2">
            <Label htmlFor="companyName" className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Building2 className="h-4 w-4 text-blue-400" />
              Company Name
            </Label>
            <Input
              id="companyName"
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              placeholder="Enter company name"
              className={`transition-all duration-200 bg-gray-700 border-gray-600 text-white placeholder-gray-400 ${
                errors.companyName 
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-900/20' 
                  : 'focus:border-blue-400 focus:ring-blue-900/20'
              }`}
            />
            {errors.companyName && (
              <p className="text-red-400 text-xs">{errors.companyName}</p>
            )}
          </div>

          {/* Designation */}
          <div className="space-y-2">
            <Label htmlFor="designation" className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Briefcase className="h-4 w-4 text-blue-400" />
              Position/Designation
            </Label>
            <Input
              id="designation"
              type="text"
              value={formData.designation}
              onChange={(e) => handleInputChange('designation', e.target.value)}
              placeholder="e.g., Senior Software Engineer"
              className={`transition-all duration-200 bg-gray-700 border-gray-600 text-white placeholder-gray-400 ${
                errors.designation 
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-900/20' 
                  : 'focus:border-blue-400 focus:ring-blue-900/20'
              }`}
            />
            {errors.designation && (
              <p className="text-red-400 text-xs">{errors.designation}</p>
            )}
          </div>

          {/* Vacancy */}
          <div className="space-y-2">
            <Label htmlFor="vacancy" className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <Users className="h-4 w-4 text-blue-400" />
              Number of Openings
            </Label>
            <Input
              id="vacancy"
              type="number"
              min="1"
              value={formData.vacancy}
              onChange={(e) => handleInputChange('vacancy', parseInt(e.target.value) || 1)}
              placeholder="Enter number of positions"
              className={`transition-all duration-200 bg-gray-700 border-gray-600 text-white placeholder-gray-400 ${
                errors.vacancy 
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-900/20' 
                  : 'focus:border-blue-400 focus:ring-blue-900/20'
              }`}
            />
            {errors.vacancy && (
              <p className="text-red-400 text-xs">{errors.vacancy}</p>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-700 border-t border-gray-600 flex gap-3">
          <Button 
            type="button"
            onClick={handleClose}
            variant="outline"
            className="flex-1 hover:bg-gray-600 transition-colors border-gray-600 text-gray-300 hover:text-white"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                Updating...
              </div>
            ) : (
              'Update Job'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditJobForm;