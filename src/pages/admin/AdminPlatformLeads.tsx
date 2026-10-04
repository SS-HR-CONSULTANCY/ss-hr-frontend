import React from "react";
import CommonTable from "@/components/common/CommonTable";
import { adminFetchAllPlatformLeads, type ImportedCustomer } from "@/utils/apis/adminPlatformLeadsApi";
import { AdminPlatformLeadsTableColumns } from "@/components/table/tableColumns/AdminPlatformLeadsTableColumn";

const AdminPlatformLeads: React.FC = () => {
  const columns = AdminPlatformLeadsTableColumns();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Platform Leads</h1>
          <p className="">Manage customer data imported from ShareMyApps</p>
        </div>
      </div>

      <CommonTable<ImportedCustomer>
        fetchApiFunction={adminFetchAllPlatformLeads}
        queryKey="admin-platform-leads"
        heading="Leads"
        description=""
        column={columns}
        columnsCount={6}
        showDummyData={false}
      />
    </div>
  );
};

export default AdminPlatformLeads;
