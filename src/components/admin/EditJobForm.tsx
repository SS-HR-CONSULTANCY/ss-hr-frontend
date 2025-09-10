import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import FormField from '../form/FormFiled';
import { Button } from '@/components/ui/button';
import AdminFormHeader from './AdminFormHeader';
import { Briefcase, Loader } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { closeEditJobForm } from '@/store/slices/jobSlice';
import type { AppDispatch, RootState } from '@/store/store';
import { CreateJobZodSchema } from '@/utils/validationSchema';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminGetJobById, adminUpdateJob } from '@/utils/apis/adminJobApi';
import type { AdminUpdateJobRequest } from '@/types/apiTypes/adminApiTypes';

const EditJobForm: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const { selectedJobId } = useSelector((state: RootState) => state.job);
  const [loading, setLoading] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => adminGetJobById(selectedJobId!),
    queryKey: ["editJob",selectedJobId],
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!selectedJobId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<AdminUpdateJobRequest>({
    resolver: zodResolver(CreateJobZodSchema),
    defaultValues: {
      companyName: "",
      designation: "",
      industry: "",
      jobDescription: "",
      benifits: "",
      salary: 0,
      skills: "",
      nationality: "",
      vacancy: 1,
    },
  });

  const watchedValues = watch();


  useEffect(() => {
  if (data) {
    reset({
      companyName: data.companyName,
      designation: data.designation,
      industry: data.industry,
      jobDescription: data.jobDescription,
      benifits: data.benifits,
      salary: data.salary,
      skills: data.skills,
      nationality: data.nationality,
      vacancy: data.vacancy,
    });
  }
}, [data, reset]);

  const onSubmit = async (data: AdminUpdateJobRequest) => {
    setLoading(true);
    if (!selectedJobId) {
      toast.error("Something wet wrong");
      return;
    }

    try {
      const response = await adminUpdateJob(selectedJobId, data);

      if (response.success) {
        toast.success(response.message || 'Job updated successfully!');
        queryClient.invalidateQueries({ queryKey: ['admin-jobs'] });
        dispatch(closeEditJobForm());
      } else {
        toast.error('Failed to update job');
      }
    } catch {
      toast.error("Job updating error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(closeEditJobForm());
  };

  console.log("data : ",data);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 overflow-hidden border border-black">

        <AdminFormHeader Icon={Briefcase} closeFn={handleClose} title='Edit Job' />

        {isLoading ? (
          <span>Loading</span>
        ) : isError && error ? (
          <span>Error</span>
        ) : data && (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div className="flex justify-around space-x-6">
              <div className="space-y-2 w-full">
                <FormField<AdminUpdateJobRequest>
                  id="companyName"
                  label="Company Name"
                  type="text"
                  placeholder="Enter company name"
                  error={errors.companyName?.message}
                  register={register}
                  />

                <FormField<AdminUpdateJobRequest>
                  id="designation"
                  label="Position/Designation"
                  type="text"
                  placeholder="e.g., Senior Software Engineer"
                  error={errors.designation?.message}
                  register={register}
                  />

                <FormField<AdminUpdateJobRequest>
                  id="industry"
                  label="Industry"
                  type="text"
                  placeholder="e.g., IT Services"
                  error={errors.industry?.message}
                  register={register}
                  />

                <FormField<AdminUpdateJobRequest>
                  id="nationality"
                  label="Preferred Nationality"
                  type="text"
                  placeholder="e.g., Indian"
                  error={errors.nationality?.message}
                  register={register}
                  />

                <FormField<AdminUpdateJobRequest>
                  id="salary"
                  label="Average Salary (LPA)"
                  type="number"
                  placeholder="Enter salary"
                  error={errors.salary?.message}
                  register={register}
                  registerOptions={{ valueAsNumber: true }}
                  />

                <FormField<AdminUpdateJobRequest>
                  id="vacancy"
                  label="Number of Openings"
                  type="number"
                  placeholder="Enter number of positions"
                  error={errors.vacancy?.message}
                  register={register}
                  registerOptions={{ valueAsNumber: true }}
                  />
              </div>

              <div className="space-y-2 w-full">
                <FormField<AdminUpdateJobRequest>
                  id="jobDescription"
                  label="Job Description"
                  type="textarea"
                  placeholder="Describe the job role..."
                  error={errors.jobDescription?.message}
                  register={register}
                  rows={4}
                  />

                <FormField<AdminUpdateJobRequest>
                  id="benifits"
                  label="Benefits (comma separated)"
                  type="textarea"
                  placeholder="e.g., Health Insurance, Work From Home"
                  error={errors.benifits?.message as string}
                  register={register}
                  rows={4}
                  />

                <FormField<AdminUpdateJobRequest>
                  id="skills"
                  label="Required Skills (comma separated)"
                  type="textarea"
                  placeholder="e.g., React, Node.js"
                  error={errors.skills?.message as string}
                  register={register}
                  rows={4}
                />

              </div>
            </div>

            <div className="px-6 py-4 border-t border-black flex gap-3">
              <Button
                type="button"
                onClick={handleClose}
                variant="outline"
                className="hover:bg-red-500 cursor-pointer hover:text-white"
                disabled={loading || !watchedValues.benifits || !watchedValues.companyName || !watchedValues.designation || !watchedValues.industry || !watchedValues.jobDescription || !watchedValues.jobDescription || !watchedValues.nationality || !watchedValues.salary || !watchedValues.skills || !watchedValues.vacancy}
                >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="outline"
                disabled={loading || !watchedValues.benifits || !watchedValues.companyName || !watchedValues.designation || !watchedValues.industry || !watchedValues.jobDescription || !watchedValues.jobDescription || !watchedValues.nationality || !watchedValues.salary || !watchedValues.skills || !watchedValues.vacancy}
                className="hover:bg-blue-500 cursor-pointer hover:text-white"
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
          </form>
        )}
      </div>
    </div>
  );
};

export default EditJobForm;