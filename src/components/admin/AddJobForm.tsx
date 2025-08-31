import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import type { AppDispatch } from '@/store/store';
import { toggleAddJobForm, addJob } from '@/store/slices/jobSlice';
import { createJob, type CreateJobRequest } from '@/utils/apis/jobApi';

interface AddJobFormProps {
  onClose?: () => void;
}

const AddJobForm: React.FC<AddJobFormProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const [formData, setFormData] = useState({
    companyName: '',
    designation: '',
    vacancy: 1
  });

  const [formErrors, setFormErrors] = useState({
    companyName: '',
    designation: '',
    vacancy: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'vacancy') {
      const numValue = parseInt(value) || 1;
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {
      companyName: '',
      designation: '',
      vacancy: ''
    };

    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    } else if (formData.companyName.length < 2) {
      errors.companyName = 'Company name must be at least 2 characters';
    }

    if (!formData.designation.trim()) {
      errors.designation = 'Designation is required';
    } else if (formData.designation.length < 2) {
      errors.designation = 'Designation must be at least 2 characters';
    }

    if (formData.vacancy < 1) {
      errors.vacancy = 'Vacancy must be at least 1';
    } else if (formData.vacancy > 1000) {
      errors.vacancy = 'Vacancy cannot exceed 1000';
    }

    setFormErrors(errors);
    return !Object.values(errors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const jobData: CreateJobRequest = {
        companyName: formData.companyName.trim(),
        designation: formData.designation.trim(),
        vacancy: formData.vacancy
      };

      const response = await createJob(jobData);
      
      if (response.success) {
        toast.success(response.message || 'Job created successfully!');
        
        // Add job to Redux store
        dispatch(addJob(response.job));
        
        // Reset form
        setFormData({
          companyName: '',
          designation: '',
          vacancy: 1
        });
        
        // Close modal
        handleClose();
      } else {
        toast.error('Failed to create job');
      }
      
    } catch (error: any) {
      console.error('Create job error:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to create job';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      dispatch(toggleAddJobForm());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Add New Job</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Enter company name"
                className={formErrors.companyName ? 'border-red-500' : ''}
              />
              {formErrors.companyName && (
                <p className="text-sm text-red-500">{formErrors.companyName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                placeholder="Enter job designation"
                className={formErrors.designation ? 'border-red-500' : ''}
              />
              {formErrors.designation && (
                <p className="text-sm text-red-500">{formErrors.designation}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vacancy">Number of Vacancies</Label>
              <Input
                id="vacancy"
                name="vacancy"
                type="number"
                min="1"
                max="1000"
                value={formData.vacancy}
                onChange={handleInputChange}
                placeholder="Enter number of vacancies"
                className={formErrors.vacancy ? 'border-red-500' : ''}
              />
              {formErrors.vacancy && (
                <p className="text-sm text-red-500">{formErrors.vacancy}</p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Job'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddJobForm;