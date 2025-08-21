import React from 'react';
import Overview from './AdminOverview';
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

  const { sidebarOpen } = useSelector((state: RootState) => state.app);

  return (
    <div className="h-screen bg-white dark:bg-black text-balck dark:text-white flex">
      <Sidebar />

      <div className={`flex-1 flex flex-col p-2 overflow-y-scroll ${sidebarOpen ? "w-[85%]" : "w-[95%]"}`}>
        <AdminHeader user={user} />
        <Overview />
      </div>
    </div>
  );
};

export default AdminDashboard;