import { toast } from "react-toastify";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { updateProfileImage } from "@/utils/apis/userApi";
import ProfileDetail from "@/components/user/ProfileDetail";
import noProfileImage from "../../assets/defaultImgaes/noProfile.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { updateProfileImageResponse } from "@/types/apiTypes/authApiTypes";
import { useDispatch } from "react-redux";

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
    <div className="border-3 rounded-md border-blue-950 dark:border-gray-300">

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

      <Tabs defaultValue="personalInfo" className="w-full p-4">
        <TabsList className="w-full flex flex-wrap justify-start gap-2 md:gap-4 mb-6 bg-0 text-gray-700 dark:text-white">
          <TabsTrigger value="profile" className="cursor-pointer">Profile</TabsTrigger>
          <TabsTrigger value="personalInfo" className="cursor-pointer">Personal Info</TabsTrigger>
          <TabsTrigger value="address" className="cursor-pointer">Address</TabsTrigger>
          <TabsTrigger value="education" className="cursor-pointer">Education</TabsTrigger>
          <TabsTrigger value="experience" className="cursor-pointer">Experience</TabsTrigger>
          <TabsTrigger value="projects" className="cursor-pointer">Projects</TabsTrigger>
          <TabsTrigger value="achievements" className="cursor-pointer">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <h3 className="text-lg md:text-xl font-semibold">
            Profile Details
          </h3>
          <ProfileDetail />
        </TabsContent>

        <TabsContent value="personalInfo" className="space-y-4">
          <h3 className="text-lg md:text-xl font-semibold">
            Personal Information
          </h3>
        </TabsContent>

        <TabsContent value="address" className="space-y-4">
          <h3 className="text-lg md:text-xl font-semibold">Address Details</h3>
          <p>Form for updating address will go here.</p>
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <h3 className="text-lg md:text-xl font-semibold">
            Education Information
          </h3>
          <p>Form for adding educational details will go here.</p>
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          <h3 className="text-lg md:text-xl font-semibold">Experience</h3>
          <p>Form for managing work experience will go here.</p>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <h3 className="text-lg md:text-xl font-semibold">Projects</h3>
          <p>Form for adding or editing projects will go here.</p>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <h3 className="text-lg md:text-xl font-semibold">Achievements</h3>
          <p>Form for listing achievements or awards will go here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
