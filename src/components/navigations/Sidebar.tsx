import {
  Users,
  Briefcase,
  LogOut,
  PanelLeft,
  HandCoins,
  Star,
  CalendarCheck,
  LayoutGrid,
  LayoutDashboard,
  Building,
  MessageCircle,
  Notebook,
  Settings,
  User,
  Mail,
  FileText,
  Ticket,
  Plane,
  BriefcaseBusiness,
  CreditCard,
} from "lucide-react";
import React from "react";
import { SingleTab } from "./SingleTab";
import { NavLink } from "react-router-dom";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import useAuthHook from "@/hooks/useAuthHook";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import type { SidebarProps } from "@/types/componentTypes/sidebarTypes";
import { toggleAdminSidebar } from "@/store/slices/appSlice";

const Sidebar: React.FC<SidebarProps> = ({ routes }) => {
  const { handleLogout } = useAuthHook();
  const dispatch = useDispatch<AppDispatch>();
  const { sidebarOpen } = useSelector((state: RootState) => state.app);
  const { user } = useSelector((state: RootState) => state.auth);

  const iconMap: Record<string, React.ReactNode> = {
    overview: <LayoutDashboard />,
    users: <Users />,
    companies: <Building />,
    jobs: <Briefcase />,
    packages: <LayoutGrid />,
    applications: <CalendarCheck />,
    enquiries: <Mail />,
    "whatsapp-enquiries": <IconBrandWhatsapp />,
    payments: <HandCoins />,
    "payment-tracking": <CreditCard />,
    reviews: <Star />,
    reports: <Notebook />,
    logout: <LogOut />,
    chat: <MessageCircle />,
    settings: <Settings />,
    profile: <User />,
    "visa-status": <FileText />,
    "ticket-status": <Ticket />,
    "tour-package-status": <Plane />,
    "job-hunting-package-status": <BriefcaseBusiness />,
  };

  const getIcon = (name: string): React.ReactNode => {
    const normalizedName = normalizeRouteName(name);
    return iconMap[normalizedName];
  };

  const normalizeRouteName = (name: string): string => {
    return name.toLowerCase().replace(/ /g, "-");
  };

  return (
    <div
      className="w-64 bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-700 text-slate-800 dark:text-white border-r border-slate-200 dark:border-slate-800 shadow-xs overflow-y-scroll no-scrollbar transition-all duration-300 hidden md:flex flex-col"
    >
      <div className="p-4 flex-1">
        <ul className="space-y-3">
          <li className="px-3 pb-4">
            <span className="text-3xl font-bold italic rounded-lg cursor-pointer">
              Dashboard
            </span>
          </li>
          
          {routes.map((route) => {
            return (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) =>
                  `block ${isActive ? "bg-slate-100 text-blue-600 font-semibold dark:bg-slate-600 dark:text-white rounded-lg" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"} transition-colors duration-200`
                }
              >
                <SingleTab
                  icon={getIcon(route.name)}
                  text={route.name}
                  sidebarOpen={true}
                />
              </NavLink>
            );
          })}
        </ul>
      </div>

      <ul className="p-4">

        <SingleTab
          icon={<LogOut />}
          text="Logout"
          onClick={handleLogout}
          sidebarOpen={true}
        />
      </ul>
    </div>
  );
};

export default Sidebar;
