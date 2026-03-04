import React from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import FormField from "../../form/FormFiled";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import AdminFormHeader from "../AdminFormHeader";
import type { AppDispatch } from "@/store/store";
import { Briefcase, Loader } from "lucide-react";
import { createJob } from "@/utils/apis/adminJobApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { closeAddJobForm } from "@/store/slices/jobSlice";
import { createJobSchema } from "@/utils/zod/adminZod";
import type { CreateJobForm } from "@/utils/zod/adminZod";
import type { AdminCreateNewJob } from "@/types/apiTypes/adminApiTypes";

const AddJobForm: React.FC = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CreateJobForm>({
    resolver: zodResolver(createJobSchema) as any,
    mode: "onChange",
    defaultValues: {
      companyName: "",
      benifits: "",
      salary: "" as any,
      vacancy: 1,
      currency: "Rs",
    },
  });

  const onSubmit: SubmitHandler<CreateJobForm> = async (data) => {
    try {
      const formattedData: AdminCreateNewJob = {
        companyName: data.companyName,
        designation: data.designation,
        location: data.location,
        jobDescription: data.jobDescription,
        benifits: data.benifits ?? "",
        salary: Number(data.salary),
        vacancy: Number(data.vacancy),
        currency: data.currency as "Rs" | "AED",
      };
      const response = await createJob(formattedData);
      if (response.success) {
        toast.success(response.message || "Job created successfully!");
        queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
        dispatch(closeAddJobForm());
      } else {
        toast.error("Failed to create job");
      }
    } catch {
      toast.error("Job adding failed");
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
                rows={3}
              />


            </div>
          </div>

          <div className="px-6 py-4 border-t border-black flex gap-3">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              variant="outline"
            >
              {isSubmitting ? (
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
