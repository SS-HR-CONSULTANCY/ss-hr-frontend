import React, { useState } from "react";
import AdminBillsTable from "./AdminBillsTable";
import BillsOverview from "@/components/admin/bills/BillsOverview";
import { BarChart2, List } from "lucide-react";

type Tab = "overview" | "list";

const AdminBills: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("list");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "list", label: "Bills List", icon: <List className="w-4 h-4" /> },
    { id: "overview", label: "Overview", icon: <BarChart2 className="w-4 h-4" /> },
  ];

  return (
    <div className="px-2 sm:px-6 pb-2 sm:pb-6 pt-0 sm:pt-2 w-full max-w-[100vw] overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-border mb-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-[#00838f] text-[#00838f]"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && <BillsOverview />}
      {activeTab === "list" && <AdminBillsTable />}
    </div>
  );
};

export default AdminBills;
