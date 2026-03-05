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
  CreditCard,
} from "lucide-react";
import React from "react";
import { SingleTab } from "./SingleTab";
import { NavLink } from "react-router-dom";
import useAuthHook from "@/hooks/useAuthHook";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import type { SidebarProps } from "@/types/componentTypes/sidebarTypes";
import { toggleAdminSidebar } from "@/store/slices/appSlice";

const Sidebar: React.FC<SidebarProps> = ({ routes }) => {
  const { handleLogout } = useAuthHook();
  const dispatch = useDispatch<AppDispatch>();
  const { sidebarOpen } = useSelector((state: RootState) => state.app);

  const iconMap: Record<string, React.ReactNode> = {
    overview: <LayoutDashboard />,
    users: <Users />,
    companies: <Building />,
    jobs: <Briefcase />,
    packages: <LayoutGrid />,
    applications: <CalendarCheck />,
    enquiries: <Mail />,
    payments: <HandCoins />,
    "payment-tracking": <CreditCard />,
    testimonials: <Star />,
    reports: <Notebook />,
    logout: <LogOut />,
    chat: <MessageCircle />,
    settings: <Settings />,
    profile: <User />,
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
      className={` ${sidebarOpen ? "w-[15%]" : "w-[5%]"} text-white overflow-y-scroll no-scrollbar transition-all duration-300 hidden md:flex flex-col border-r bg-gradient-to-r from-slate-900 to-slate-700`}
    >
      <div className="p-4 flex-1">
        <ul className="space-y-3">
          <li className="px-3 pb-4">
            <span className="text-3xl font-bold italic rounded-lg cursor-pointer">
              {sidebarOpen ? "Dashboard" : <LayoutDashboard />}
            </span>
          </li>

          <SingleTab
            icon={<PanelLeft />}
            text="Close"
            onClick={() => dispatch(toggleAdminSidebar())}
            sidebarOpen={sidebarOpen}
          />

          {routes.map((route) => {
            return (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) =>
                  `block ${isActive ? "bg-slate-600 rounded-lg" : ""} transition-colors duration-200`
                }
              >
                <SingleTab
                  icon={getIcon(route.name)}
                  text={route.name}
                  sidebarOpen={sidebarOpen}
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
          sidebarOpen={sidebarOpen}
        />
      </ul>
    </div>
  );
};

export default Sidebar;
