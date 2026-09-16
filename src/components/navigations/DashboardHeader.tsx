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
    <header className="p-3 border-b border-slate-200 dark:border-slate-800 shadow-xs bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={user?.profileImage || noProfile}
            className="rounded-full size-6 object-cover"
          />
          <h5 className="text-sm font-semibold text-slate-800 dark:text-white">
            Hi, {user?.fullName || user?.role}
          </h5>
        </div>
        <div className="flex items-center space-x-4">
          <button
            title="Go to Home"
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors cursor-pointer"
            onClick={() => navigate("/")}
          >
            <HomeIcon className="size-5" />
          </button>

          <button
            title="Log out"
            className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-600 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 transition-colors cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
