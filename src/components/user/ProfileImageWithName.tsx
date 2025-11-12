import { Button } from "../ui/button";
import { toast } from "react-toastify";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileImage } from "@/utils/apis/userApi";
import type { AppDispatch, RootState } from "@/store/store";
import { useForm, type SubmitHandler } from "react-hook-form";
import { setProfileSignedUrl } from "@/store/slices/authSlice";
import noProfileImage from "../../assets/defaultImgaes/noProfile.png";
import { profileImageZodSchema, type ProfileImageForm } from "@/utils/validationSchema";
import { deleteUserFileFromS3, getSignedUrl, getUploadUrl, uploadToS3 } from "@/utils/apis/s3Api";
import { Edit } from "lucide-react";

const ProfileImageWithName: React.FC = () => {

    const dispatch = useDispatch<AppDispatch>();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const { user } = useSelector((state: RootState) => state.auth);

    const {
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
        setValue,
        watch
    } = useForm<ProfileImageForm>({
        resolver: zodResolver(profileImageZodSchema),
        defaultValues: {
            profileImage: undefined,
        },
    });

    const profileImageFile = watch("profileImage");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setValue("profileImage", file, { shouldValidate: true });
        }
    };

    const onSubmit: SubmitHandler<ProfileImageForm> = async (data) => {
        const file = data.profileImage;
        try {
            if (!user || !user._id) {
                toast.error("User not found");
                return;
            }
            
            if (file && user?.profileImage) {
                await deleteUserFileFromS3("profiles");
            }

            const { uploadUrl, key } = await getUploadUrl(file, user._id, "profiles");

            await uploadToS3(file, uploadUrl);
            const res = await dispatch(updateProfileImage({ profileImage: key })).unwrap();

            if (res.success) {
                toast.success(res.message || "Profile image updated successfully");
                const signedUrl = await getSignedUrl(key);
                dispatch(setProfileSignedUrl(signedUrl));
                setSelectedImage(null);
            } else {
                toast.error(res.message || "Failed to update profile image");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload profile image");
        }
    };

    return (
        <div className="flex items-center">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="relative">
                    <img
                        src={
                            selectedImage
                                ? selectedImage
                                : user?.profileImage
                                    ? user.profileImage
                                    : noProfileImage
                        }
                        alt="Profile"
                        className="size-32 md:size-40 object-cover rounded-md border shadow"
                    />

                    <label
                        htmlFor="profileImageUpload"
                        className="absolute bottom-2 right-2 bg-white dark:bg-slate-700 p-2 rounded-full shadow hover:bg-slate-100 dark:hover:bg-slate-600 transition cursor-pointer"
                    >
                        <Edit />
                    </label>

                    <input
                        type="file"
                        id="profileImageUpload"
                        accept="image/png,image/jpg,image/jpeg"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {errors.profileImage && (
                        <p className="text-red-500 text-sm mt-2">{errors.profileImage.message}</p>
                    )}

                </div>
                {(profileImageFile && selectedImage) && (
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        variant="outline"
                        className="cursor-pointer mt-1 w-full"
                        disabled={isSubmitting || !profileImageFile || !isValid}
                    >
                        {isSubmitting ? "Uploading..." : "Update"}                </Button>
                )}
            </form>

            <div className="items-center text-gray-700 dark:text-white ml-3">
                <h2 className="mt-4 font-bold text-2xl md:text-4xl">
                    {user?.fullName || "User"}
                </h2>
                <h6 className="font-medium text-lg">
                    {user?.professionalStatus ?? "Professional Status"}
                </h6>
            </div>
        </div>
    )
}

export default ProfileImageWithName;