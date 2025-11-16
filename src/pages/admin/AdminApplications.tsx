import React from "react";
import CommonTable from "@/components/common/CommonTable";
import TablePageHeader from "@/components/common/TablePageHeader";
import { useAdminApplications } from "@/hooks/useAdminApplications";
import { adminFetchAllPApplications } from "@/utils/apis/adminApplicationApi";
import type { AdminfetchAllApplicationsResponse } from "@/types/apiTypes/adminApiTypes";
import { AdminApplicationsTableColumns } from "@/components/table/tableColumns/AdminApplicationTableColumn";

const AdminApplications: React.FC = () => {
  const { handleViewApplicationDetails } = useAdminApplications();

  const columns = AdminApplicationsTableColumns(handleViewApplicationDetails);

  return (
    <>
      <TablePageHeader title="Applications" subtitle="View job applications" />
      <CommonTable<AdminfetchAllApplicationsResponse>
        fetchApiFunction={adminFetchAllPApplications}
        queryKey="applications"
        heading="Job Applications"
        description="List of job applications from users"
        column={columns}
        columnsCount={5}
      />
    </>
  );
};

export default AdminApplications;
