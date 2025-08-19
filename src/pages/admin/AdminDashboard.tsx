import {
  Users,
  Building2,
  FileText,
  Settings,
  Briefcase,
  BarChart3,
  LayoutDashboard,
  FileChartColumn,
} from "lucide-react";
import React from 'react';
import Overview from './Overview';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import type { LucideIcon } from 'lucide-react';
import { useAppSelector } from '../../hooks/redux';
import Sidebar from '@/components/navigations/Sidebar';
import AdminHeader from '@/components/navigations/AdminHeader';

export interface sidebarItems {
  id: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  count?: string;
}

const AdminDashboard: React.FC = () => {

  const { user } = useAppSelector((state) => state.auth);

  const sidebarItems: sidebarItems[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, active: true },
    { id: "users", label: "User Management", icon: Users, count: "1,247" },
    { id: "companies", label: "Companies", icon: Building2, count: "156" },
    { id: "jobs", label: "Job Listings", icon: Briefcase, count: "89" },
    { id: "applications", label: "Applications", icon: FileText, count: "2,156" },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "reports", label: "Reports", icon: FileChartColumn },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  const { adminSidebar } = useSelector((state: RootState) => state.app);

  return (
    <div className="h-screen bg-white dark:bg-black text-balck dark:text-white flex">
      <Sidebar user={user} sidebarItems={sidebarItems} />

      <div className={`flex-1 flex flex-col p-2 overflow-y-scroll ${adminSidebar ? "w-[85%]" : "w-[95%]"}`}>
        <AdminHeader user={user} />
        <Overview />
      </div>
    </div>
  );
};

export default AdminDashboard;