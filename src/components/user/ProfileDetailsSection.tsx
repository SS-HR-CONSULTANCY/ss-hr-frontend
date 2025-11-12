import { Edit } from "lucide-react";
import { toast } from "react-toastify";
import React, { useState } from "react";
import FormField from "../form/FormFiled";
import { DateField } from "../ui/date-picker";
import { PhoneInput } from "../ui/phone-input";
import { Button } from "@/components/ui/button";
import { genderOptions } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector, useDispatch } from "react-redux";
import { updateProfileInfo } from "@/utils/apis/userApi";
import { CountryDropdown } from "../ui/country-dropdown";
import type { AppDispatch, RootState } from "@/store/store";
import { cleanEmptyFields } from "@/utils/helpers/formDataCleaner";
import { handleFormError } from "@/utils/helpers/formErrorCatcher";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { userProfileDataSchema, type ProfileDataForm } from "@/utils/userZod";

const ProfileDetailsSection: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useSelector((state: RootState) => state.auth);

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        setFocus,
    } = useForm<ProfileDataForm>({
        resolver: zodResolver(userProfileDataSchema),
        mode: "onChange",
        defaultValues: {
            fullName: user?.fullName || "",
            email: user?.email || "",
            phone: user?.phone || "",
            phoneTwo: user?.phoneTwo || "",
            gender: user?.gender,
            nationality: user?.nationality || "",
            linkedInUsername: user?.linkedInUsername || "",
            portfolioUrl: user?.portfolioUrl || "",
            dob: user?.dob || "",
            professionalStatus: user?.professionalStatus || "",
        },
    });

    const onSubmit: SubmitHandler<ProfileDataForm> = async (data) => {
        try {
            const cleanedData = cleanEmptyFields(data);
            await dispatch(updateProfileInfo(cleanedData as ProfileDataForm))
                .unwrap()
                .then((res) => {
                    if (res.success) {
                        toast.success(res.message || "User profile updated successfully!");
                        setIsEditing(false);
                    } else {
                        toast.error(res.message || "Failed to update profile!");
                    }
                });
        } catch {
            toast.error("Error updating profile data!");
        }
    };

    return (
        <div className="p-4 md:p-6 rounded-md border mt-4 shadow-md">
            <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-2xl font-semibold my-2">
                    Profile Details
                </h3>
                {!isEditing && (
                    <Button
                        variant={"outline"}
                        onClick={() => setIsEditing((prev) => !prev)}
                        className="text-xs md:text-sm px-3 py-1 cursor-pointer"
                    >
                        <Edit /> {"Edit"}
                    </Button>
                )}
            </div>

            <form onSubmit={handleSubmit(onSubmit, handleFormError(setFocus))}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <FormField<ProfileDataForm>
                        id="fullName"
                        label="Full Name"
                        placeholder={isEditing ? "Enter full name" : "Not provided"}
                        type="text"
                        register={register}
                        error={errors.fullName?.message}
                        defaultValue={user?.fullName}
                        readOnly={!isEditing}
                        required={isEditing}
                    />

                    <FormField<ProfileDataForm>
                        id="email"
                        label="Email"
                        placeholder={"Not provided"}
                        type="text"
                        register={register}
                        error={errors.email?.message}
                        defaultValue={user?.email}
                        readOnly={true}
                        required={false}
                    />

                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Phone 1 {isEditing && (<span className="mx-2 text-red-500">*</span>)}
                                </label>
                                <PhoneInput
                                    id="phone"
                                    defaultCountry="AE"
                                    placeholder={isEditing ? "Enter phone number" : "Not provided"}
                                    value={field.value}
                                    onChange={(val) => field.onChange(val || "")}
                                    disabled={!isEditing}
                                    error={errors.phone?.message}
                                />
                            </div>
                        )}
                    />

                    <Controller
                        name="phoneTwo"
                        control={control}
                        render={({ field }) => (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Phone 2 {isEditing && (<span className="mx-2 text-red-500">*</span>)}
                                </label>
                                <PhoneInput
                                    id="phoneTwo"
                                    defaultCountry="AE"
                                    placeholder={isEditing ? "Enter phone number" : "Not provided"}
                                    value={field.value}
                                    onChange={(val) => field.onChange(val || "")}
                                    disabled={!isEditing}
                                    error={errors.phoneTwo?.message}
                                />
                            </div>
                        )}
                    />

                    <FormField<ProfileDataForm>
                        id="gender"
                        label="Gender"
                        placeholder={isEditing ? "Enter gender" : "Not provided"}
                        type="select"
                        register={register}
                        error={errors.gender?.message}
                        defaultValue={user?.gender}
                        readOnly={!isEditing}
                        required={isEditing}
                        defaultSelectOptions="Select Gender"
                        options={genderOptions}
                    />

                    <Controller
                        name="nationality"
                        control={control}
                        rules={{ required: "Nationality is required" }}
                        render={({ field }) => (
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium">Nationality{isEditing && (<span className="mx-2 text-red-500">*</span>)}</label>
                                <CountryDropdown
                                    defaultValue={field.value}
                                    disabled={!isEditing}
                                    onChange={(nationality) => field.onChange(nationality.alpha3)}
                                />
                                {errors.nationality && (
                                    <span className="text-xs text-red-500">
                                        {errors.nationality.message}
                                    </span>
                                )}
                            </div>
                        )}
                    />

                    <Controller
                        name="dob"
                        control={control}
                        render={({ field }) => (
                            <DateField
                                label="Date of Birth"
                                value={field.value ? new Date(field.value) : undefined}
                                onChange={(date) => field.onChange(date?.toISOString() || "")}
                                disabled={!isEditing}
                                required={isEditing}
                                error={errors.dob?.message}
                            />
                        )}
                    />

                    <FormField<ProfileDataForm>
                        id="professionalStatus"
                        label="Professional Status"
                        placeholder={isEditing ? "Enter Professional Status" : "Not provided"}
                        type="text"
                        register={register}
                        error={errors.professionalStatus?.message}
                        defaultValue={user?.professionalStatus}
                        readOnly={!isEditing}
                        required={isEditing}
                    />

                    <FormField<ProfileDataForm>
                        id="linkedInUsername"
                        label="LinkedIn Username"
                        placeholder={isEditing ? "Enter LinkedIn Username" : "Not provided"}
                        type="text"
                        register={register}
                        error={errors.linkedInUsername?.message}
                        defaultValue={user?.linkedInUsername}
                        readOnly={!isEditing}
                        required={false}
                    />

                    <FormField<ProfileDataForm>
                        id="portfolioUrl"
                        label="Portfolio"
                        placeholder={isEditing ? "Enter portfolio url" : "Not provided"}
                        type="text"
                        register={register}
                        error={errors.portfolioUrl?.message}
                        defaultValue={user?.portfolioUrl}
                        readOnly={!isEditing}
                        required={false}
                    />

                </div>

                {isEditing && (
                    <div className="mt-4 space-x-4">
                        <Button
                            type="submit"
                            variant="outline"
                            disabled={isSubmitting}
                            className="text-xs md:text-sm px-3 py-1 cursor-pointer"
                        >
                            {isSubmitting ? "Updating" : "Save Changes"}
                        </Button>
                        <Button
                            variant={"destructive"}
                            onClick={() => {
                                setIsEditing((prev) => !prev);
                                reset();
                            }}
                            className="text-xs md:text-sm px-3 py-1 cursor-pointer"
                        >
                            {"Cancel"}
                        </Button>
                    </div>
                )}

            </form>
        </div>
    );
};

export default ProfileDetailsSection;
