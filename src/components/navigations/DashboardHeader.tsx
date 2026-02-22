import React from "react";
import useAuthHook from "@/hooks/useAuthHook";
import { useNavigate } from "react-router-dom";
import { HomeIcon, LogOut } from "lucide-react";
import noProfile from "../../assets/defaultImgaes/noProfile.png";
import type { DashboardHeaderProps } from "@/types/componentTypes/AdminHeaderTypes";

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const navigate = useNavigate();
  const { handleLogout } = useAuthHook();

  return (
    <header className="p-3 border shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={user?.profileImage || noProfile}
            className="rounded-full size-6"
          />
          <h5>Hi, {user?.fullName || user?.role}</h5>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="relative flex rounded-full cursor-pointer"
            onClick={() => navigate("/")}
          >
            <HomeIcon />
          </button>

          <button
            className="relative flex rounded-full cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
