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
  const { sidebarOpen } = useSelector((state: RootState) => state.app);

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(checkUserStatus());
    }
  }, []);

  return (
    <>
      {showMobileScreenWarning && (
        <div className="block md:hidden">
          <MobileWarning />
        </div>
      )}
      {/* from-slate-50 to-sky-50 dark:from-slate-800 dark:to-black */}
      {/* from-white to-white dark:from-slate-800 dark:to-zinc-800 */}
      <div className="h-screen bg-gradient-to-r from-slate-50 to-sky-50 dark:from-slate-800 dark:to-zinc-800 text-balck dark:text-white flex">
        <Sidebar routes={routes} />
        <div
          className={`flex-1 flex flex-col ${sidebarOpen ? "w-[85%]" : "w-[95%]"}`}
        >
          <div className="shrink-0">
            <DashboardHeader user={user} />
          </div>

          <div className="flex-1 overflow-y-auto p-2 md:p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
