import {
  Users,
  Briefcase,
  LogOut,
  PanelLeft,
  Gauge,
  HandCoins,
  Star,
  CalendarCheck,
  LayoutGrid,
  Settings,
  LayoutDashboard
} from 'lucide-react';
import React from "react";
import { SingleTab } from "./SingleTab";
import { Moon, Sun } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { adminRoutes } from '@/utils/constants';
import { logoutUser } from '@/store/slices/authSlice';
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import { toggleAdminSidebar, toggleTheme } from "@/store/slices/appSlice";

const Sidebar: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { theme, adminSidebar } = useSelector((state: RootState) => state.app);

  const iconMap: Record<string, React.ReactNode> = {
    'overview': <LayoutDashboard />,
    'users': <Users />,
    'companies': <Briefcase />,
    'jobs': <Briefcase />,
    'packages': <LayoutGrid />,
    'applications': <CalendarCheck />,
    'payments': <HandCoins />,
    'reviews': <Star />,
    'analytics': <Gauge />,
    'reports': <LayoutGrid />,
    'settings': <Settings />,
    'logout': <LogOut />,
  }

  const getIcon = (name: string): React.ReactNode => {
    const normalizedName = normalizeRouteName(name);
    return iconMap[normalizedName];
  }

  const normalizeRouteName = (name: string): string => {
    return name.toLowerCase().replace(/ /g, "-");
  }

   const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            navigate('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

  return (
    <div className={` ${adminSidebar ? 'w-[15%]' : 'w-[5%]'} overflow-y-scroll no-scrollbar transition-all duration-300 flex flex-col border-r border-slate-400 dark:border-slate-700`} >
      <div className="p-4 flex-1">
        <ul>

          <li className='px-3 pb-4'>
            <span className='text-black dark:text-white text-3xl font-bold italic hover:bg-gray-300 hover:text-black px-2 rounded-lg cursor-pointer'>{adminSidebar ? "ADMIN" : "A"}</span>
          </li>

          <SingleTab icon={<PanelLeft />} text="Close" onClick={() => dispatch(toggleAdminSidebar())} sidebarOpen={adminSidebar} />

          {adminRoutes.map((route) => (
            <SingleTab
              key={route.path}
              icon={getIcon(route.name)}
              text={route.name}
              sidebarOpen={adminSidebar}
            />
          ))}
        </ul>
      </div>

      <ul className='p-4'>
        <SingleTab
          icon={theme === "dark" ? <Sun /> : <Moon />}
          text={theme}
          onClick={() => dispatch(toggleTheme())}
          sidebarOpen={adminSidebar}
        />
        <SingleTab
          icon={<LogOut />}
          text="Logout"
          onClick={handleLogout}
          sidebarOpen={adminSidebar}
        />
      </ul>

    </div>
  );
};

export default Sidebar;
