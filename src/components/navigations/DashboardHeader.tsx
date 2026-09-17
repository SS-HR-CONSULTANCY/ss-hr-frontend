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
    <header className="px-4 py-3 border-b-2 border-[#b2ebf2] bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={user?.profileImage || noProfile}
            className="rounded-full size-7 object-cover ring-2 ring-[#80deea]"
          />
          <h5 className="text-sm font-semibold text-[#00838f]">
            Hi, {user?.fullName || user?.role}
          </h5>
        </div>
        <div className="flex items-center space-x-2">
          <button
            title="Go to Home"
            className="p-1.5 rounded-full hover:bg-[#e0f7fa] text-[#00b5cc] hover:text-[#00838f] transition-colors cursor-pointer"
            onClick={() => navigate("/")}
          >
            <HomeIcon className="size-5" />
          </button>

          <button
            title="Log out"
            className="p-1.5 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
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
