import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";

import { createCareerData } from "@/utils/apis/userApi";
import type { AppDispatch, RootState } from "@/store/store";
import { careerDataSchema, type CareerData } from "@/utils/validationSchema";
import FormField from "../form/FormFiled";
import { MultiSelectButtonGroup } from "../form/MultiSelectButtonGroup";

const jobTypeOptions = [
  { label: "Full Time", value: "full-time" },
  { label: "Part Time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
];

const workModeOptions = [
  { label: "Onsite", value: "onsite" },
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
];

const CareerPreferencesSection: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userCareerData } = useSelector((state: RootState) => state.user);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CareerData>({
    resolver: zodResolver(careerDataSchema),
    defaultValues: userCareerData || {},
  });

  const selectedJobTypes = watch("preferredJobTypes") || [];
  const selectedWorkModes = watch("preferredWorkModes") || [];

  const isImmediateJoiner = watch("immediateJoiner");
  const [isEditing, setIsEditing] = useState(false);

  const onSubmit: SubmitHandler<CareerData> = async (data) => {
    try {
      await dispatch(createCareerData(data))
        .unwrap()
        .then((res) => {
          if (res.success) {
            toast.success(res.message || "Career data updated successfully!");
            setIsEditing(false);
            reset();
          } else {
            toast.error(res.message || "Failed to update career data!");
          }
        })
        .catch((error) => {
          toast.error(error.message || "Error updating career data");
        });
    } catch {
      toast.error("Unexpected error while updating career data");
    }
  };

  return (
    <div className="p-4 md:p-6 rounded-md border mt-4 shadow-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg md:text-2xl font-semibold my-2">
          Career Preferences
        </h3>
      </div>

      {(!userCareerData && !isEditing) ? (
        <div className="rounded-md w-full p-4 flex flex-col justify-center items-center border space-y-2">
          <p>No data found</p>
          <Button
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="text-xs md:text-sm px-3 py-1 cursor-pointer"
          >
            Add your career data
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Salary fields */}
          <FormField<CareerData>
            id="currentSalary"
            label="Current Salary"
            placeholder="Enter current salary"
            type="number"
            register={register}
            error={errors.currentSalary?.message}
            defaultValue={userCareerData?.currentSalary}
            readOnly={!isEditing}
          />

          <FormField<CareerData>
            id="expectedSalary"
            label="Expected Salary"
            placeholder="Enter expected salary"
            type="number"
            register={register}
            error={errors.expectedSalary?.message}
            defaultValue={userCareerData?.expectedSalary}
            readOnly={!isEditing}
          />

          {/* Immediate joiner toggle */}
          <FormField<CareerData>
            id="immediateJoiner"
            label="Immediate Joiner"
            type="select"
            register={register}
            error={errors.immediateJoiner?.message}
            defaultValue={String(userCareerData?.immediateJoiner ?? "")}
            readOnly={!isEditing}
          >
            <>
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </>
          </FormField>

          {/* Notice Period (only if not immediate joiner) */}
          {!isImmediateJoiner && (
            <FormField<CareerData>
              id="noticePeriod"
              label="Notice Period (in days)"
              placeholder="Enter notice period"
              type="number"
              register={register}
              error={errors.noticePeriod?.message}
              defaultValue={userCareerData?.noticePeriod}
              readOnly={!isEditing}
            />
          )}

          {/* Other career fields */}
          <FormField<CareerData>
            id="experience"
            label="Total Experience"
            placeholder="e.g. 3 years"
            type="text"
            register={register}
            error={errors.experience?.message}
            defaultValue={userCareerData?.experience}
            readOnly={!isEditing}
          />

          <FormField<CareerData>
            id="currentDesignation"
            label="Current Designation"
            placeholder="Enter your role"
            type="text"
            register={register}
            error={errors.currentDesignation?.message}
            defaultValue={userCareerData?.currentDesignation}
            readOnly={!isEditing}
          />

          <FormField<CareerData>
            id="currentCompany"
            label="Current Company"
            placeholder="Enter company name"
            type="text"
            register={register}
            error={errors.currentCompany?.message}
            defaultValue={userCareerData?.currentCompany}
            readOnly={!isEditing}
          />

          <FormField<CareerData>
            id="industry"
            label="Industry"
            placeholder="Enter industry name"
            type="text"
            register={register}
            error={errors.industry?.message}
            defaultValue={userCareerData?.industry}
            readOnly={!isEditing}
          />

          {/* Job Type Select */}
          <FormField<CareerData>
            id="currentJobType"
            label="Current Job Type"
            type="select"
            register={register}
            error={errors.currentJobType?.message}
            defaultValue={userCareerData?.currentJobType}
            readOnly={!isEditing}
          >
            <>
              <option value="">Select Job Type</option>
              {jobTypeOptions.map((job) => (
                <option key={job.value} value={job.value}>
                  {job.label}
                </option>
              ))}
            </>
          </FormField>


        {/* Preferred Job Types */}
<MultiSelectButtonGroup<CareerData>
  id="preferredJobTypes"
  label="Preferred Job Types"
  options={jobTypeOptions}
  selectedValues={selectedJobTypes}
  setValue={setValue}
  disabled={!isEditing}
  error={errors.preferredJobTypes?.message}
/>

{/* Preferred Work Modes */}
<MultiSelectButtonGroup<CareerData>
  id="preferredWorkModes"
  label="Preferred Work Modes"
  options={workModeOptions}
  selectedValues={selectedWorkModes}
  setValue={setValue}
  disabled={!isEditing}
  error={errors.preferredWorkModes?.message}
/>


          <FormField<CareerData>
            id="resumeUrl"
            label="Resume URL"
            placeholder="Enter your resume link"
            type="text"
            register={register}
            error={errors.resumeUrl?.message}
            defaultValue={userCareerData?.resumeUrl}
            readOnly={!isEditing}
          />

          {isEditing && (
            <div className="col-span-2 flex justify-end mt-4">
              <Button type="submit" className="px-4 py-2">
                Save
              </Button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default CareerPreferencesSection;
