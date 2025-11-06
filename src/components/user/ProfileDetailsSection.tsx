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
import { userProfileSchema } from "@/utils/validationSchema";
import type { UpdateUserInfo } from "@/types/apiTypes/userApiTypes";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";

const ProfileDetailsSection: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        reset,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<UpdateUserInfo>({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {
            fullName: user?.fullName || "",
            email: user?.email || "",
            phone: user?.phone || "",
            phoneTwo: user?.phoneTwo || "",
            gender: user?.gender,
            nationality: user?.nationality || "",
            linkedInUrl: user?.linkedInUrl || "",
            portfolioUrl: user?.portfolioUrl || "",
            dob: user?.dob || "",
        },
    });

    const onSubmit: SubmitHandler<UpdateUserInfo> = async (data) => {
        try {
            const res = await dispatch(updateProfileInfo(data)).unwrap();
            if (res.success) {
                toast.success(res.message || "User profile updated successfully!");
                setIsEditing(false);
            } else {
                toast.error(res.message || "Failed to update profile!");
            }
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

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <FormField<UpdateUserInfo>
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

                    <FormField<UpdateUserInfo>
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
                                />
                            </div>
                        )}
                    />

                    <FormField<UpdateUserInfo>
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
                            />
                        )}
                    />

                    <FormField<UpdateUserInfo>
                        id="linkedInUrl"
                        label="LinkedIn"
                        placeholder={isEditing ? "Enter LinkedIn URL" : "Not provided"}
                        type="text"
                        register={register}
                        error={errors.linkedInUrl?.message}
                        defaultValue={user?.linkedInUrl}
                        readOnly={!isEditing}
                        required={false}
                    />

                    <FormField<UpdateUserInfo>
                        id="portfolioUrl"
                        label="Portfolio"
                        placeholder={isEditing ? "Enter portfolio URL" : "Not provided"}
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
                            className="text-xs md:text-sm px-3 py-1 cursor-pointer"
                        >
                            Save Changes
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
