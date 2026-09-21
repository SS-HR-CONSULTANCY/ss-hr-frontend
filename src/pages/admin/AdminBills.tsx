import React from "react";
import AdminBillsTable from "./AdminBillsTable";

const AdminBills: React.FC = () => {
  return (
    <div className="px-2 sm:px-6 pb-2 sm:pb-6 pt-0 sm:pt-2 w-full max-w-[100vw] overflow-hidden">
      <AdminBillsTable />
    </div>
  );
};

export default AdminBills;
