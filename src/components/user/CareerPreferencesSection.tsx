import { Edit } from "lucide-react";
import { toast } from "react-toastify";
import FormField from "../form/FormFiled";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { getCleanFileName } from "@/utils/helpers/filenameReducer";
import { MultiSelectButtonGroup } from "../form/MultiSelectButtonGroup";
import { createCareerData, updateCareerData } from "@/utils/apis/userApi";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { careerDataSchema, type CareerData } from "@/utils/validationSchema";
import { booleanOptions, jobTypeOptions, workModeOptions } from "@/utils/constants";
import { deleteFileFromS3, getSignedUrl, getUploadUrl, uploadToS3 } from "@/utils/apis/s3Api";
import type { UpdateUserCareerDataRequest } from "@/types/apiTypes/userApiTypes";

const CareerPreferencesSection: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const [isEditing, setIsEditing] = useState(false);
    const [resumeUrl, setResumeUrl] = useState<string | null>(null);
    const { userCareerData } = useSelector((state: RootState) => state.user);
    const { user } = useSelector((state: RootState) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        watch,
        setValue,
        formState: { errors },
    } = useForm<CareerData>({
        resolver: zodResolver(careerDataSchema) as unknown as Resolver<CareerData>,
        defaultValues: {
            currentSalary: userCareerData?.currentSalary || 0,
            expectedSalary: userCareerData?.expectedSalary || 0,
            immediateJoiner: userCareerData?.immediateJoiner ?? false,
            noticePeriod: userCareerData?.noticePeriod || 0,
            experience: userCareerData?.experience || "0 months",
            currentDesignation: userCareerData?.currentDesignation || "",
            currentCompany: userCareerData?.currentCompany || "",
            industry: userCareerData?.industry || "",
            currentJobType: userCareerData?.currentJobType,
            preferredJobTypes: userCareerData?.preferredJobTypes,
            preferredWorkModes: userCareerData?.preferredWorkModes,
            resume: userCareerData?.resume as FileList,
        },
    });

    useEffect(() => {
        const fetchResumeUrl = async () => {
            if (userCareerData?.resume) {
                const signedUrl = await getSignedUrl(userCareerData.resume as string);
                setResumeUrl(signedUrl);
            }
        };
        fetchResumeUrl();
    }, [userCareerData]);

    const selectedJobTypes = watch("preferredJobTypes") || [];
    const selectedWorkModes = watch("preferredWorkModes") || [];
    const isImmediateJoiner = watch("immediateJoiner") === true;

    const onSubmit: SubmitHandler<CareerData> = async (data) => {
        try {
            if (!user) {
                toast.error("User not found. Please log in again.");
                return;
            }

            const isUpdate = !!userCareerData;
            const file: File | undefined = data.resume?.[0];
            let resumeKey: string = userCareerData?.resume as string || "";

            if (file) {
                if (isUpdate && userCareerData.resume) {
                    await deleteFileFromS3(userCareerData.resume as string);
                }

                const { uploadUrl, key } = await getUploadUrl(file, user._id, "resumes");
                await uploadToS3(file, uploadUrl);
                resumeKey = key;
            }

            const payload = {
                ...data,
                resume: resumeKey,
            };

            const action = isUpdate ? updateCareerData : createCareerData;
            if(isUpdate) {
                (payload as UpdateUserCareerDataRequest)._id = userCareerData?._id
            }

            const res = await dispatch(action(payload)).unwrap();

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

                        <FormField<CareerData>
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
                            defaultSelectOptions="Select Joining Type"
                            options={booleanOptions}
                        />

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
                                required={!isImmediateJoiner && isEditing}
                            />
                        )}

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
                            info="Allowed file types: .pdf, .doc, .docx"
                        />

                        <FormField<CareerData>
                            id="currentJobType"
                            label="Current Job Type"
                            type="select"
                            register={register}
                            error={errors.currentJobType?.message}
                            defaultValue={userCareerData?.currentJobType}
                            readOnly={!isEditing}
                            defaultSelectOptions="Select Job Type"
                            options={jobTypeOptions}
                        />

                        <MultiSelectButtonGroup<CareerData>
                            id="preferredJobTypes"
                            label="Preferred Job Types"
                            options={jobTypeOptions}
                            selectedValues={selectedJobTypes}
                            setValue={setValue}
                            disabled={!isEditing}
                            error={errors.preferredJobTypes?.message}
                            isEditing
                        />

                        <MultiSelectButtonGroup<CareerData>
                            id="preferredWorkModes"
                            label="Preferred Work Modes"
                            options={workModeOptions}
                            selectedValues={selectedWorkModes}
                            setValue={setValue}
                            disabled={!isEditing}
                            error={errors.preferredWorkModes?.message}
                            isEditing
                        />


                        {userCareerData?.resume && !isEditing && resumeUrl ? (
                            <div className="flex flex-col space-y-2">
                                <label className="font-medium text-sm">Resume</label>
                                <div className="flex items-center justify-between p-3 border rounded-md">
                                    <div className="truncate max-w-[70%]">
                                        <span className="text-sm font-medium">
                                            {getCleanFileName(resumeUrl as string)}
                                        </span>
                                    </div>
                                    <div className="flex space-x-2">
                                        {resumeUrl ? (
                                            <a
                                                href={resumeUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline text-sm"
                                            >
                                                View
                                            </a>
                                        ) : (
                                            <span className="text-gray-400 text-sm">Loading...</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <FormField<CareerData>
                                id="resume"
                                label="Resume"
                                placeholder="Enter your resume link"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                register={register}
                                error={errors.resume?.message}
                                readOnly={!isEditing}
                                required={(!userCareerData && isEditing)}
                                info="Allowed file types: .pdf, .doc, .docx"
                            />
                        )}
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
