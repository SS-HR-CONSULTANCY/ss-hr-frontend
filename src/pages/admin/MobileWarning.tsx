import React from "react";
import { Monitor } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import DashboardHeader from "@/components/navigations/DashboardHeader";

const MobileWarning: React.FC = () => {
  const { user } = useSelector((store: RootState) => store.auth);

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-r from-slate-100 to-stone-200 dark:from-slate-900 dark:to-zinc-900">
      <DashboardHeader user={user} />
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <Monitor className="w-24 h-24 text-zinc-600 dark:text-zinc-300 mb-6" />
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
          Desktop Only
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-base max-w-md">
          Please login on your desktop to access the{" "}
          <span className="font-medium">Admin Dashboard</span> for the full
          experience.
        </p>
      </div>
    </div>
  );
};

export default MobileWarning;
