import React from "react";
import ResumeSection from "@/components/user/ResumeSection";
import UserAddressSection from "@/components/user/UserAddressSection";
import ProfileImageWithName from "@/components/user/ProfileImageWithName";
import ProfileDetailsSection from "@/components/user/ProfileDetailsSection";
import CareerPreferencesSection from "@/components/user/CareerPreferencesSection";

const UserProfile: React.FC = () => {
  return (
    <div className="border-2 rounded-md border-blue-950 dark:border-gray-300 p-2 md:p-4">
      <div className="flex items-center justify-between w-full p-4">
        <ProfileImageWithName />
        <ResumeSection />
      </div>

      <ProfileDetailsSection />

      <UserAddressSection />

      <CareerPreferencesSection />
    </div>
  );
};

export default UserProfile;
