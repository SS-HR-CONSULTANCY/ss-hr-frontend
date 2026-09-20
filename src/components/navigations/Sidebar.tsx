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
  UserCog,
  PhoneCall,
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
    "leads-accounts": <UserCog />,
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
    "follow-ups": <PhoneCall />,
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
      className="w-64 bg-white text-slate-700 border-r border-[#b2ebf2] shadow-sm overflow-y-scroll no-scrollbar transition-all duration-300 hidden md:flex flex-col"
    >
      <div className="p-4 flex-1">
        <ul className="space-y-5">
          <li className="px-3 pb-5 pt-2">
            <span className="text-2xl font-bold tracking-tight" style={{ color: "#00b5cc" }}>
              Dashboard
            </span>
          </li>
          
          {routes.map((route) => {
            return (
              <NavLink
                key={route.path}
                to={route.path}
                className={({ isActive }) =>
                  `block rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-[#e0f7fa] text-[#00838f] font-semibold border-l-4 border-[#00b5cc]"
                      : "text-slate-500 hover:bg-[#f0fbfc] hover:text-[#00b5cc]"
                  }`
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

      <ul className="p-4 border-t border-[#b2ebf2]">
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
