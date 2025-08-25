import { toast } from "react-toastify";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import UpdateUserInfo from "@/components/form/UpdateUserInfo";
import noProfileImage from "../../assets/defaultImgaes/noProfile.png";
import { updateProfileImage, type updateProfileImageResponse } from "@/utils/apis/authApi";

const UserProfile: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { user, profileImageUpdating } = useSelector((state: RootState) => state.auth);
  const [userInfoForm, setUserInfoForm] = useState<boolean>(false);

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
    <div className="space-y-5 md:space-y-10 p-2 md:p-5">
      <section className="md:mx-auto w-full md:max-w-7xl  p-6 bg-gradient-to-r from-slate-50 to-sky-50 dark:from-slate-800 dark:to-black rounded-md shadow-md">
        <h2 className="text-lg md:text-2xl font-bold mb-4 text-center">User Profile</h2>
        <div className="flex flex-col items-center justify-center border rounded-md p-4">

          <div className="md:w-1/3 flex flex-col items-center">
            <div className="relative">
              <img
                src={
                  user?.profileImg
                    ? user?.profileImg
                    : selectedImage
                      ? selectedImage
                      : noProfileImage
                }
                alt="Profile"
                className="size-32 md:size-40 object-cover rounded-full border shadow"
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
            </div>
            <p>{profileImageUpdating && "Profile image updating..."}</p>
            <p className="mt-4 font-semibold text-[16px] md:text-lg">
              {user?.fullName || "User"}
            </p>
          </div>

          <div className="rounded-lg w-full p-4 md:p-6 space-y-4 md:max-w-[50%]">
            <div className="flex justify-between items-center">
              <dt className="text-sm md:text-lg font-medium text-muted-foreground">Full Name</dt>
              <dd className="text-sm md:text-lg">{user?.fullName || "Not provided"}</dd>
            </div>

            <div className="flex justify-between items-center">
              <dt className="text-sm md:text-lg font-medium text-muted-foreground">Email</dt>
              <dd className="text-sm md:text-lg">{user?.email || "Not provided"}</dd>
            </div>

            <div className="flex justify-between items-center">
              <dt className="text-sm md:text-lg font-medium text-muted-foreground">Phone 1</dt>
              <dd className="text-sm md:text-lg">{user?.phoneOne || "Not provided"}</dd>
            </div>

            <div className="flex justify-between items-center">
              <dt className="text-sm md:text-lg font-medium text-muted-foreground">Phone 2</dt>
              <dd className="text-sm md:text-lg">{user?.phoneTwo || "Not provided"}</dd>
            </div>
          </div>


          <div className="p-4 md:p-6 flex">
            <Button
              variant={"outline"}
              onClick={() => setUserInfoForm(!userInfoForm)}
              className="text-xs md:text-sm px-2 py-1 md:px-3 md:py-1 border rounded-md hover:bg-accent hover:text-accent-foreground transition"
            >
              Edit info
            </Button>
          </div>

        </div>
      </section>


      {/* Update user info Form section */}
      {userInfoForm && (
        <UpdateUserInfo />
      )}

    </div>
  );
};

export default UserProfile;
