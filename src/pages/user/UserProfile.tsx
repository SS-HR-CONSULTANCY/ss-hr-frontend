import { toast } from "react-toastify";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateProfileImage } from "@/utils/apis/userApi";
import ProfileDetail from "@/components/user/ProfileDetail";
import type { AppDispatch, RootState } from "@/store/store";
import noProfileImage from "../../assets/defaultImgaes/noProfile.png";
import type { updateProfileImageResponse } from "@/types/apiTypes/userApiTypes";
import UserAddress from "@/components/user/UserAddress";
import CareerPreferences from "@/components/user/CareerPreferences";

const UserProfile: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { user, profileImageUpdating } = useSelector(
    (state: RootState) => state.auth,
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);

    const formData = new FormData();
    formData.append("profileImage", file);

    await dispatch(updateProfileImage(formData))
      .unwrap()
      .then((res: updateProfileImageResponse) => {
        toast.success(res.message);
      })
      .catch(() => {
        toast.error("Profile image updating error");
      });
  };

  return (
    <div className="border-2 rounded-md border-blue-950 dark:border-gray-300 p-2 md:p-4">

      <div className="flex items-center justify-center w-full p-4 space-x-4">
        <div className="relative">
          <img
            src={
              user?.profileImage
                ? user?.profileImage
                : selectedImage
                  ? selectedImage
                  : noProfileImage
            }
            alt="Profile"
            className="size-32 md:size-40 object-cover rounded-md border shadow"
          />
          <label
            htmlFor="profileImageUpload"
            className="absolute bottom-2 right-2 bg-white dark:bg-slate-700 p-2 rounded-full shadow hover:bg-slate-100 dark:hover:bg-slate-600 transition cursor-pointer"
          >
            ✏️
          </label>
          <input
            type="file"
            id="profileImageUpload"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <p>{profileImageUpdating && "Profile image updating..."}</p>
        </div>
        <p className="mt-4 font-bold text-2xl md:text-4xl text-gray-700 dark:text-white">
          {user?.fullName || "User"}
        </p>
      </div>

      <ProfileDetail />

      <UserAddress />

      <CareerPreferences />

      {/* <h3 className="text-lg md:text-xl font-semibold">Education Information</h3>

      <h3 className="text-lg md:text-xl font-semibold">Experience</h3>

      <h3 className="text-lg md:text-xl font-semibold">Projects</h3>

      <h3 className="text-lg md:text-xl font-semibold">Achievements</h3>  */}

    </div>
  );
};

export default UserProfile;
