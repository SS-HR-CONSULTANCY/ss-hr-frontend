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
  Receipt,
  ClipboardList,
  Crown,
  Layers,
  Smartphone,
  ListTodo,
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

import { useQuery } from "@tanstack/react-query";
import { adminFetchAllEnquiries } from "@/utils/apis/adminEnquiryApi";
import { adminFetchAllWhatsappEnquiries } from "@/utils/apis/adminWhatsappEnquiryApi";
import { adminFetchAllPlatformLeads } from "@/utils/apis/adminPlatformLeadsApi";
import { adminFetchAllBills } from "@/utils/apis/adminBillApi";
import { adminFetchDailyDutiesPendingCount } from "@/utils/apis/adminDailyDutyApi";

const Sidebar: React.FC<SidebarProps> = ({ routes }) => {
  const { handleLogout } = useAuthHook();
  const dispatch = useDispatch<AppDispatch>();
  const { sidebarOpen } = useSelector((state: RootState) => state.app);
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: todayFollowUpsCount = 0 } = useQuery({
    queryKey: ["adminMixedFollowUpsTodayCount"],
    queryFn: async () => {
      try {
        const [webRes, waRes] = await Promise.all([
          adminFetchAllEnquiries({ 
            pagination: { page: 1, limit: 1000, status: "need_follow_up" } 
          }),
          adminFetchAllWhatsappEnquiries({ 
            pagination: { page: 1, limit: 1000, status: "need_follow_up" } 
          })
        ]);
        const webData = webRes?.data || [];
        const waData = waRes?.data || [];
        const merged = [...webData, ...waData];
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return merged.filter((item: any) => {
          if (!item.reminder) return false;
          const reminderDate = new Date(item.reminder);
          reminderDate.setHours(0, 0, 0, 0);
          return reminderDate.getTime() === today.getTime();
        }).length;
      } catch (e) {
        return 0;
      }
    },
    refetchInterval: 60000, // Refresh every minute
  });

  const { data: pendingContactsCount = 0 } = useQuery({
    queryKey: ["adminPendingContactsCount"],
    queryFn: async () => {
      try {
        const res = await adminFetchAllPlatformLeads({
          pagination: { page: 1, limit: 1, scheduledDate: "any" },
        });
        return res?.stats?.pending || 0;
      } catch (e) {
        return 0;
      }
    },
    refetchInterval: 60000,
  });

  const { data: pendingReviewsCount = 0 } = useQuery({
    queryKey: ["adminBills", "pendingReviewsCount"],
    queryFn: async () => {
      try {
        const res = await adminFetchAllBills({
          pagination: { page: 1, limit: 1000 },
        });
        const bills = res?.data || [];
        return bills.filter((b: any) => b.googleReviewStatus !== "reviewed").length;
      } catch (e) {
        return 0;
      }
    },
    refetchInterval: 60000,
  });

  const { data: dailyDutyCounts = { pendingCount: 0, stuckCount: 0 } } = useQuery({
    queryKey: ["dailyDutyPendingCount", user?._id],
    queryFn: adminFetchDailyDutiesPendingCount,
    refetchInterval: 30000,
  });

  const dailyDutiesPendingCount = dailyDutyCounts.pendingCount;
  const stuckDutiesCount = dailyDutyCounts.stuckCount;

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
    bills: <Receipt />,
    "bills-&-payments": <Receipt />,
    "payments-&-review": <Receipt />,
    "payments-&-google-review": <Receipt />,
    "payments-google-review": <Receipt />,
    "payment-google-review": <Receipt />,
    "expenses-and-costs": <CreditCard />,
    logs: <ClipboardList />,
    "platform-leads": <Users />,
    "contact-list": <PhoneCall />,
    "super-overview": <Crown className="text-amber-500" />,
    "daily-duties": <ListTodo className="text-teal-600" />,
    "full-stack-solutions": <Layers className="text-indigo-500" />,
    "share-my-apps": <Smartphone className="text-emerald-500" />,
  };

  const isTony =
    user?.role === "admin" &&
    (user?.email === "tony" ||
      user?.fullName === "Super Admin" ||
      (user as any)?.username === "tony");

  const getIcon = (name: string, path?: string): React.ReactNode => {
    if (path && iconMap[path]) return iconMap[path];
    const normalizedName = normalizeRouteName(name);
    if (iconMap[normalizedName]) return iconMap[normalizedName];
    if (path === "bills" || normalizedName.includes("payment") || normalizedName.includes("bill") || normalizedName.includes("google")) {
      return <Receipt />;
    }
    return undefined;
  };

  const normalizeRouteName = (name: string): string => {
    return name.toLowerCase().replace(/ /g, "-");
  };

  return (
    <div
      className="w-72 bg-white text-slate-700 border-r border-[#b2ebf2] shadow-sm overflow-y-scroll no-scrollbar transition-all duration-300 hidden md:flex flex-col"
    >
      <div className="p-4 flex-1">
        <ul className="space-y-3">
          <li className="px-3 pb-3 pt-2">
            <span className="text-2xl font-bold tracking-tight block truncate capitalize" style={{ color: "#00b5cc" }} title={user?.fullName || user?.email || "Dashboard"}>
              {user?.fullName || user?.email || "Dashboard"}
            </span>
          </li>
          
          {routes.filter((r) => {
            // Super overview is strictly exclusive to Tony (Super Admin)
            if (r.path === "super-overview") {
              return isTony;
            }
            // Hide standard overview from Super Admin since he has Super Overview
            if (r.path === "overview" && isTony) {
              return false;
            }
            if (isTony) return true;
            if (r.path === "daily-duties") return true;
            if (user?.role === "staff" && r.path === "telecaller-leads") return true;
            if (user?.permissions?.includes("all")) return true;
            if (user?.permissions && user.permissions.length > 0) {
              return user.permissions.includes(r.path);
            }
            if (user?.role === "admin") return true;
            return false;
          }).map((route) => {
            const normalizedName = normalizeRouteName(route.name);
            const isBills =
              normalizedName === "payments-&-review" ||
              normalizedName === "payments-&-google-review" ||
              normalizedName === "bills-&-payments" ||
              route.path === "bills";
            const isDailyDuties = route.path === "daily-duties" || normalizedName === "daily-duties";
            const badge =
              normalizedName === "follow-ups"
                ? todayFollowUpsCount
                : normalizedName === "contact-list"
                ? pendingContactsCount
                : isBills
                ? pendingReviewsCount
                : isDailyDuties
                ? dailyDutiesPendingCount > 0
                  ? dailyDutiesPendingCount
                  : stuckDutiesCount > 0
                  ? stuckDutiesCount
                  : undefined
                : undefined;
            const badgeColor =
              isBills
                ? "bg-amber-500"
                : normalizedName === "contact-list"
                ? "bg-orange-500"
                : isDailyDuties
                ? stuckDutiesCount > 0
                  ? "bg-rose-500 animate-pulse"
                  : "bg-orange-500"
                : "bg-red-500";

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
                  icon={getIcon(route.name, route.path)}
                  text={route.name}
                  sidebarOpen={true}
                  badge={badge}
                  badgeColor={badgeColor}
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
