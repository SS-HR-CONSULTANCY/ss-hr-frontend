import { toast } from "react-toastify";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import FormField from "../form/FormFiled";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import AdminFormHeader from "./AdminFormHeader";
import type { AppDispatch } from "@/store/store";
import { Briefcase, Loader } from "lucide-react";
import { createJob } from "@/utils/apis/adminJobApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { closeAddJobForm } from "@/store/slices/jobSlice";
import { CreateJobZodSchema } from "@/utils/validationSchema";
import type { AdminCreateNewJob } from "@/types/apiTypes/adminApiTypes";

const AddJobForm: React.FC = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AdminCreateNewJob>({
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

  const onSubmit = async (data: AdminCreateNewJob) => {
    setIsLoading(true);
    try {
      const response = await createJob(data);
      if (response.success) {
        toast.success(response.message || "Job created successfully!");
        queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
        dispatch(closeAddJobForm());
      } else {
        toast.error("Failed to create job");
      }
    } catch {
      toast.error("Job adding failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    dispatch(closeAddJobForm());
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-700 text-black dark:text-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 border border-black max-h-screen overflow-y-scroll">
        <AdminFormHeader
          Icon={Briefcase}
          closeFn={handleClose}
          title="Add New Job"
        />

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="flex justify-around space-x-6">
            <div className="space-y-2 w-full">
              <FormField<AdminCreateNewJob>
                id="companyName"
                label="Company Name"
                type="text"
                placeholder="Enter company name"
                error={errors.companyName?.message}
                register={register}
              />

              <FormField<AdminCreateNewJob>
                id="designation"
                label="Position/Designation"
                type="text"
                placeholder="e.g., Senior Software Engineer"
                error={errors.designation?.message}
                register={register}
              />

              <FormField<AdminCreateNewJob>
                id="industry"
                label="Industry"
                type="text"
                placeholder="e.g., IT Services"
                error={errors.industry?.message}
                register={register}
              />

              <FormField<AdminCreateNewJob>
                id="nationality"
                label="Preferred Nationality"
                type="text"
                placeholder="e.g., Indian"
                error={errors.nationality?.message}
                register={register}
              />

              <FormField<AdminCreateNewJob>
                id="salary"
                label="Average Salary (LPA)"
                type="number"
                placeholder="Enter salary"
                error={errors.salary?.message}
                register={register}
                registerOptions={{ valueAsNumber: true }}
              />

              <FormField<AdminCreateNewJob>
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
              <FormField<AdminCreateNewJob>
                id="jobDescription"
                label="Job Description"
                type="textarea"
                placeholder="Describe the job role..."
                error={errors.jobDescription?.message}
                register={register}
                rows={4}
              />

              <FormField<AdminCreateNewJob>
                id="benifits"
                label="Benefits (comma separated)"
                type="textarea"
                placeholder="e.g., Health Insurance, Work From Home"
                error={errors.benifits?.message as string}
                register={register}
                rows={3}
              />

              <FormField<AdminCreateNewJob>
                id="skills"
                label="Required Skills (comma separated)"
                type="text"
                placeholder="e.g., React, Node.js"
                error={errors.skills?.message as string}
                register={register}
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-black flex gap-3">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !watchedValues.salary ||
                !watchedValues.companyName ||
                !watchedValues.designation ||
                !watchedValues.vacancy
              }
              variant="outline"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create Job"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJobForm;
