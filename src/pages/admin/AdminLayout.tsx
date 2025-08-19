import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import type { RootState } from "@/store/store";
import Sidebar from "@/components/navigations/Sidebar";
import AdminHeader from "@/components/navigations/AdminHeader";

const AdminLayout: React.FC = () => {

  const { user } = useSelector((state: RootState) => state.auth);
  const { adminSidebar } = useSelector((state: RootState) => state.app);

  return (
    <div className="h-screen bg-gradient-to-r from-slate-50 to-stone-200 dark:from-slate-800 dark:to-zinc-800 text-balck dark:text-white flex">
      <Sidebar />
      <div className={`flex-1 flex flex-col p-6 overflow-y-scroll ${adminSidebar ? "w-[85%]" : "w-[95%]"}`}>
        <AdminHeader user={user} />
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
