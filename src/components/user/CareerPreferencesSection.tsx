import { Edit } from "lucide-react";
import { toast } from "react-toastify";
import React, { useState } from "react";
import FormField from "../form/FormFiled";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { MultiSelectButtonGroup } from "../form/MultiSelectButtonGroup";
import { createCareerData, updateCareerData } from "@/utils/apis/userApi";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
// import { careerDataSchema, type CareerData } from "@/utils/validationSchema";
import type { UpdateUserCareerDataRequest } from "@/types/apiTypes/userApiTypes";
import { booleanOptions, jobTypeOptions, workModeOptions } from "@/utils/constants";
import { careerDataSchema, type CareerDataForm } from "@/utils/zod/userZod";
import { cleanEmptyFields } from "@/utils/helpers/formDataCleaner";

const CareerPreferencesSection: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const [isEditing, setIsEditing] = useState(false);
    const { userCareerData } = useSelector((state: RootState) => state.user);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        watch,
        setValue,
        formState: { errors },
    } = useForm<CareerDataForm>({
        resolver: zodResolver(careerDataSchema) as unknown as Resolver<CareerDataForm>,
        defaultValues: {
            currentSalary: userCareerData?.currentSalary,
            expectedSalary: userCareerData?.expectedSalary,
            immediateJoiner: userCareerData?.immediateJoiner ?? true,
            noticePeriod: userCareerData?.noticePeriod,
            experience: userCareerData?.experience || "",
            currentDesignation: userCareerData?.currentDesignation || "",
            currentCompany: userCareerData?.currentCompany || "",
            industry: userCareerData?.industry || "",
            currentJobType: userCareerData?.currentJobType,
            preferredJobTypes: userCareerData?.preferredJobTypes,
            preferredWorkModes: userCareerData?.preferredWorkModes,
        },
    });

    const selectedJobTypes = watch("preferredJobTypes") || [];
    const selectedWorkModes = watch("preferredWorkModes") || [];
    const isImmediateJoiner = watch("immediateJoiner") === true;

    const onSubmit: SubmitHandler<CareerDataForm> = async (data) => {
        try {
            const isUpdate = !!userCareerData;
            const action = isUpdate ? updateCareerData : createCareerData;
            if (isUpdate) {
                (data as UpdateUserCareerDataRequest)._id = userCareerData?._id
            }

            const cleanedData = cleanEmptyFields(data);
            const res = await dispatch(action(cleanedData as CareerDataForm)).unwrap();

            if (res.success) {
                toast.success(
                    res.message ||
                    (isUpdate
                        ? "Career data updated successfully!"
                        : "Career data saved successfully!")
                );
                setIsEditing(false);
            } else {
                toast.error(
                    res.message ||
                    (isUpdate
                        ? "Failed to update career data!"
                        : "Failed to save career data!")
                );
            }
        } catch {
            toast.error("Unexpected error while saving career data");
        }
    };

    return (
        <div className="p-4 md:p-6 rounded-md border mt-4 shadow-md">
            <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-2xl font-semibold my-2">
                    Additional Information
                </h3>
                {userCareerData && (
                    <Button
                        variant={"outline"}
                        onClick={() => setIsEditing((prev) => !prev)}
                        className="text-xs md:text-sm px-3 py-1 cursor-pointer"
                    >
                        <Edit /> {"Edit"}
                    </Button>
                )}
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField<CareerDataForm>
                            id="currentSalary"
                            label="Current Salary"
                            placeholder="Enter current salary"
                            type="number"
                            register={register}
                            error={errors.currentSalary?.message}
                            defaultValue={userCareerData?.currentSalary}
                            readOnly={!isEditing}
                            required={isEditing}
                        />

                        <FormField<CareerDataForm>
                            id="expectedSalary"
                            label="Expected Salary"
                            placeholder="Enter expected salary"
                            type="number"
                            register={register}
                            error={errors.expectedSalary?.message}
                            defaultValue={userCareerData?.expectedSalary}
                            readOnly={!isEditing}
                            required={isEditing}
                        />

                        <FormField<CareerDataForm>
                            id="immediateJoiner"
                            label="Immediate Joiner"
                            type="select"
                            register={register}
                            registerOptions={{
                                setValueAs: (v: string) => v === "true",
                            }}
                            error={errors.immediateJoiner?.message}
                            defaultValue={String(userCareerData?.immediateJoiner ?? "")}
                            readOnly={!isEditing}
                            defaultSelectOptions="Joining Type"
                            options={booleanOptions}
                            required={isEditing}
                        />

                        {!isImmediateJoiner && (
                            <FormField<CareerDataForm>
                                id="noticePeriod"
                                label="Notice Period (in days)"
                                placeholder="Enter notice period"
                                type="number"
                                register={register}
                                error={errors.noticePeriod?.message}
                                defaultValue={userCareerData?.noticePeriod}
                                readOnly={!isEditing}
                                required={!isImmediateJoiner && isEditing}
                            />
                        )}

                        <FormField<CareerDataForm>
                            id="experience"
                            label="Total Experience"
                            placeholder="e.g. 3 years"
                            type="text"
                            register={register}
                            error={errors.experience?.message}
                            defaultValue={userCareerData?.experience}
                            readOnly={!isEditing}
                            required={isEditing}
                        />

                        <FormField<CareerDataForm>
                            id="currentJobType"
                            label="Current Job Type"
                            type="select"
                            register={register}
                            error={errors.currentJobType?.message}
                            defaultValue={userCareerData?.currentJobType}
                            readOnly={!isEditing}
                            defaultSelectOptions="Job Type"
                            options={jobTypeOptions}
                            required={isEditing}
                        />

                        <FormField<CareerDataForm>
                            id="currentDesignation"
                            label="Current Designation"
                            placeholder="Enter your role"
                            type="text"
                            register={register}
                            error={errors.currentDesignation?.message}
                            defaultValue={userCareerData?.currentDesignation}
                            readOnly={!isEditing}
                        />

                        <FormField<CareerDataForm>
                            id="currentCompany"
                            label="Current Company"
                            placeholder="Enter company name"
                            type="text"
                            register={register}
                            error={errors.currentCompany?.message}
                            defaultValue={userCareerData?.currentCompany}
                            readOnly={!isEditing}
                        />

                        <FormField<CareerDataForm>
                            id="industry"
                            label="Industry"
                            placeholder="Enter industry name"
                            type="text"
                            register={register}
                            error={errors.industry?.message}
                            defaultValue={userCareerData?.industry}
                            readOnly={!isEditing}
                            info="Allowed file types: .pdf, .doc, .docx"
                        />

                        <MultiSelectButtonGroup<CareerDataForm>
                            id="preferredJobTypes"
                            label="Preferred Job Types"
                            options={jobTypeOptions}
                            selectedValues={selectedJobTypes}
                            setValue={setValue}
                            disabled={!isEditing}
                            error={errors.preferredJobTypes?.message}
                            isEditing
                        />

                        <MultiSelectButtonGroup<CareerDataForm>
                            id="preferredWorkModes"
                            label="Preferred Work Modes"
                            options={workModeOptions}
                            selectedValues={selectedWorkModes}
                            setValue={setValue}
                            disabled={!isEditing}
                            error={errors.preferredWorkModes?.message}
                            isEditing
                        />
                    </div>

                    {isEditing && (
                        <div className="mt-4 space-x-4">
                            <Button
                                disabled={isSubmitting}
                                type="submit"
                                variant="outline"
                                className="text-xs md:text-sm px-3 py-1 cursor-pointer"
                            >
                                {isSubmitting ? "Saving..." : !userCareerData ? "Save Details" : "Save Changes"}
                            </Button>
                            <Button
                                disabled={isSubmitting}
                                variant={"destructive"}
                                onClick={() => setIsEditing((prev) => !prev)}
                                className="text-xs md:text-sm px-3 py-1 cursor-pointer"
                            >
                                {"Cancel"}
                            </Button>
                        </div>
                    )}
                </form>
            )}
        </div>
    );
};

export default CareerPreferencesSection;
