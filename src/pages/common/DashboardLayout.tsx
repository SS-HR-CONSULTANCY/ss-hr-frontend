import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import type { RootState } from '@/store/store';
import MobileWarning from '../admin/MobileWarning';
import Sidebar from '@/components/navigations/Sidebar';
import DashboardHeader from '@/components/navigations/DashboardHeader';
import type { DashboardLayoutProps } from '@/types/componentTypes/dashboardLayoutTypes';

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  showMobileScreenWarning,
  routes
}) => {

  const { user } = useSelector((state: RootState) => state.auth);
  const { sidebarOpen } = useSelector((state: RootState) => state.app);

  return (
    <>
    {showMobileScreenWarning && (
      <div className="block md:hidden">
        <MobileWarning />
      </div>
      )}
      <div className="h-screen bg-gradient-to-r from-slate-50 to-stone-200 dark:from-slate-800 dark:to-zinc-800 text-balck dark:text-white flex">
        <Sidebar routes={routes} />
        <div className={`flex-1 flex flex-col ${sidebarOpen ? "w-[85%]" : "w-[95%]"}`}>
          <div className="shrink-0">
            <DashboardHeader user={user} />
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardLayout