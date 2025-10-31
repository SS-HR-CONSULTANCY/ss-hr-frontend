import { toast } from "react-toastify";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import FormField from "../form/FormFiled";
import { Button } from "@/components/ui/button";
import { profileDetailsArray } from "@/utils/constants";
import { updateProfileInfo } from "@/utils/apis/userApi";
import type { AppDispatch, RootState } from "@/store/store";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { updateUserInfo, updateUserInfoResponse } from "@/types/apiTypes/userApiTypes";

const ProfileDetail: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector(
        (state: RootState) => state.auth,
    );

    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<updateUserInfo>({
        defaultValues: {
            fullName: user?.fullName || "",
            phone: user?.phone || "",
            phoneTwo: user?.phoneTwo || "",
            email: user?.email || "",
            gender: user?.gender || "",
            nationality: user?.nationality || "",
            linkedInUrl: user?.linkedInUrl || "",
            portfolioUrl: user?.portfolioUrl || "",
            dob: user?.dob || "",
        },
    });

    const onSubmit: SubmitHandler<updateUserInfoResponse> = async (
        data,
    ) => {
        try {
            await dispatch(updateProfileInfo(data))
                .unwrap()
                .then((res) => {
                    if (res.success) {
                        toast.success(res.message || "User Profile data updated successfully!");
                    } else {
                        toast.error(res.message || "User Profile data updating failed!");
                    }
                })
                .catch((error) => {
                    toast.error(error.message || "User Profile data updating error");
                });
        } catch {
            toast.error("Failed to update profile data");
        }
    };

    return (
        <div className="p-4 md:p-6 rounded-md border mt-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-2xl font-semibold my-2">
                    Profile Details
                </h3>
                <Button
                    variant={isEditing ? "destructive" : "outline"}
                    onClick={() => setIsEditing((prev) => !prev)}
                    className="text-xs md:text-sm px-3 py-1 cursor-pointer"
                >
                    {isEditing ? "Cancel" : "Edit Info"}
                </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileDetailsArray.map((item) => (
                        <div key={item.key}>
                            <FormField<updateUserInfo>
                                id={item.key}
                                label={item.label}
                                placeholder={isEditing ? `Enter ${item.label.toLowerCase()}` : "Not provided"}
                                type={item.type || "text"}
                                register={register}
                                error={errors[item.key]?.message}
                                defaultValue={user?.[item.key]}
                                readOnly={!isEditing}
                            />
                        </div>
                    ))}
                </div>

                {isEditing && (
                    <div className="mt-4">
                        <Button
                            type="submit"
                            variant="outline"
                            className="text-xs md:text-sm px-3 py-1 cursor-pointer"
                        >
                            Save Changes
                        </Button>
                    </div>
                )}
            </form>
        </div>
    )
}

export default ProfileDetail