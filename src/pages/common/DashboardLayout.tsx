import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import MobileWarning from "../admin/MobileWarning";
import { checkUserStatus } from "@/utils/apis/authApi";
import Sidebar from "@/components/navigations/Sidebar";
import { type AppDispatch, type RootState } from "@/store/store";
import DashboardHeader from "@/components/navigations/DashboardHeader";
import type { DashboardLayoutProps } from "@/types/componentTypes/dashboardLayoutTypes";

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  showMobileScreenWarning,
  routes,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(checkUserStatus());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    if (showMobileScreenWarning) {
      // Scale down UI for admin side by reducing the root font size
      document.documentElement.style.fontSize = "14px";
    } else {
      document.documentElement.style.fontSize = "16px";
    }
    return () => {
      document.documentElement.style.fontSize = "16px";
    };
  }, [showMobileScreenWarning]);

  return (
    <>
      {showMobileScreenWarning && (
        <div className="block md:hidden">
          <MobileWarning />
        </div>
      )}
      <div className="h-screen bg-white text-sm text-[#00838f] flex">
        <Sidebar routes={routes} />
        <div className="flex-1 flex flex-col min-w-0">
          <div className="shrink-0">
            <DashboardHeader user={user} />
          </div>

          <div className="flex-1 overflow-y-auto px-2 pt-1 pb-2 md:px-4 md:pt-2 md:pb-4 bg-[#f0fbfc]">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
