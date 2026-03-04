import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import FormField from "../../form/FormFiled";
import { Button } from "@/components/ui/button";
import AdminFormHeader from "../AdminFormHeader";
import React, { useEffect, useState } from "react";
import { Briefcase, Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { closeEditJobForm } from "@/store/slices/jobSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminGetJobById, adminUpdateJob } from "@/utils/apis/adminJobApi";
import { createJobSchema } from "@/utils/zod/adminZod";
import type { CreateJobForm } from "@/utils/zod/adminZod";

const EditJobForm: React.FC = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const { selectedJobId } = useSelector((state: RootState) => state.job);

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => adminGetJobById(selectedJobId!),
    queryKey: ["editJob", selectedJobId],
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!selectedJobId,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm<CreateJobForm>({
    resolver: zodResolver(createJobSchema) as any,
    defaultValues: {
      companyName: "",
      designation: "",
      location: "",
      benifits: "",
      salary: "" as any,
      vacancy: 1,
      currency: "Rs",
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        companyName: data.companyName,
        designation: data.designation,
        location: data.location,
        jobDescription: data.jobDescription,
        benifits: data.benifits,
        salary: data.salary,
        vacancy: data.vacancy,
        currency: data.currency as "Rs" | "AED",
      });
    }
  }, [data, reset]);

  const onSubmit: SubmitHandler<CreateJobForm> = async (data) => {
    setLoading(true);
    if (!selectedJobId) {
      toast.error("Something wet wrong");
      return;
    }

    try {
      const formattedData = {
        ...data,
        salary: Number(data.salary),
        benifits: data.benifits ?? "",
        vacancy: Number(data.vacancy),
      };
      
      const response = await adminUpdateJob(selectedJobId, formattedData);

      if (response.success) {
        toast.success(response.message || "Job updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
        dispatch(closeEditJobForm());
      } else {
        toast.error("Failed to update job");
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

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 overflow-hidden border border-black">
        <AdminFormHeader
          Icon={Briefcase}
          closeFn={handleClose}
          title="Edit Job"
        />

        {isLoading ? (
          <span>Loading</span>
        ) : isError && error ? (
          <span>Error</span>
        ) : (
          data && (
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="flex justify-around space-x-6">
                <div className="space-y-2 w-full">
                  <FormField<CreateJobForm>
                    id="companyName"
                    label="Company Name"
                    type="text"
                    placeholder="Enter company name"
                    error={errors.companyName?.message}
                    register={register}
                  />

                  <FormField<CreateJobForm>
                    id="designation"
                    label="Position/Designation"
                    type="text"
                    placeholder="e.g., Senior Software Engineer"
                    error={errors.designation?.message}
                    register={register}
                  />

                  <FormField<CreateJobForm>
                    id="location"
                    label="Location"
                    type="text"
                    placeholder="e.g., Dubai, UAE"
                    error={errors.location?.message}
                    register={register}
                  />

                  <div className="flex gap-2">
                    <div className="w-1/3 mt-2">
                      <FormField<CreateJobForm>
                        id="currency"
                        label="Currency"
                        type="select"
                        options={[
                          { label: "Rs", value: "Rs" },
                          { label: "AED", value: "AED" },
                        ]}
                        error={errors.currency?.message}
                        register={register}
                      />
                    </div>
                    <div className="w-2/3">
                      <FormField<CreateJobForm>
                        id="salary"
                        label="Average Salary"
                        type="number"
                        placeholder="Enter salary"
                        error={errors.salary?.message}
                        register={register}
                        registerOptions={{ valueAsNumber: true }}
                      />
                    </div>
                  </div>

                  <FormField<CreateJobForm>
                    id="vacancy"
                    label="No. of Vacancies"
                    type="number"
                    placeholder="Enter number of positions"
                    error={errors.vacancy?.message}
                    register={register}
                    registerOptions={{ valueAsNumber: true }}
                  />


                </div>

                <div className="space-y-2 w-full">
                  <FormField<CreateJobForm>
                    id="jobDescription"
                    label="Job Description"
                    type="textarea"
                    placeholder="Describe the job role..."
                    error={errors.jobDescription?.message}
                    register={register}
                    rows={4}
                  />

                  <FormField<CreateJobForm>
                    id="benifits"
                    label="Benefits (comma separated)"
                    type="textarea"
                    placeholder="e.g., Health Insurance, Work From Home"
                    error={errors.benifits?.message as string}
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
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isSubmitting || !isValid}
                  className="hover:bg-blue-500 cursor-pointer hover:text-white"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader className="h-4 w-4 animate-spin" />
                      Updating...
                    </div>
                  ) : (
                    "Update Job"
                  )}
                </Button>
              </div>
            </form>
          )
        )}
      </div>
    </div>
  );
};

export default EditJobForm;
