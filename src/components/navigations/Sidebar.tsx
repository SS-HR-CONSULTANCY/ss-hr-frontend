import React, { useState } from "react";
import type { User } from "@/types/authSliceTypes";
import { Moon, PanelRight, Sun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/store";
import type { sidebarItems } from "@/pages/admin/AdminDashboard";
import logoTransparent from "../../assets/logos/logo-tranparent.png";
import { toggleAdminSidebar, toggleTheme } from "@/store/slices/appSlice";

interface SidebarProps {
  user: User | null;
  sidebarItems: sidebarItems[];
}

const Sidebar: React.FC<SidebarProps> = ({ user, sidebarItems }) => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  const dispatch = useDispatch<AppDispatch>();
  const { theme, adminSidebar } = useSelector((state: RootState) => state.app);

  return (
    <div
      className={`${
        adminSidebar ? "w-60" : "w-16"
      } bg-gray-200 dark:bg-[#0d0d0d] transition-all duration-300 flex flex-col text-black dark:text-white min-h-screen`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-black dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <img
            src={logoTransparent}
            alt="SS HR"
            className="w-10 h-10 object-contain"
          />
          {adminSidebar && (
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg">SS HR Admin</h1>
              <p className="text-sm">Control Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors cursor-pointer
                ${
                  activeTab === item.id
                    ? "bg-slate-600 text-white"
                    : "hover:bg-slate-600 hover:text-white"
                }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {adminSidebar && (
                <>
                  <span className="ml-3 flex-1 text-left">{item.label}</span>
                  {item.count && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500 text-white">
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Actions */}
      <div className="p-2 space-y-2">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="w-full flex items-center px-3 py-2 rounded-lg transition-colors hover:bg-slate-600 hover:text-white cursor-pointer"
        >
          {theme === "dark" ? (
            <>
              <Sun className="h-5 w-5 flex-shrink-0" />
              {adminSidebar && <span className="ml-3">Light</span>}
            </>
          ) : (
            <>
              <Moon className="h-5 w-5 flex-shrink-0" />
              {adminSidebar && <span className="ml-3">Dark</span>}
            </>
          )}
        </button>

        <button
          onClick={() => dispatch(toggleAdminSidebar())}
          className="w-full flex items-center px-3 py-2 rounded-lg transition-colors hover:bg-slate-600 hover:text-white cursor-pointer"
        >
          <PanelRight className="h-5 w-5 flex-shrink-0" />
          {adminSidebar && <span className="ml-3">Close</span>}
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-300 dark:border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.fullName?.charAt(0) || "A"}
          </div>
          {adminSidebar && (
            <div className="flex-1 hidden sm:block">
              <p className="font-medium truncate">{user?.fullName || "Admin"}</p>
              <p className="text-sm truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
