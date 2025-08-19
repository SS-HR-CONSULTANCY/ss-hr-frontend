import React from 'react';
import CommonTable from '@/components/common/CommonTable';
import { applicationsDummyData } from '@/utils/constants';
import { adminFetchAllPApplications } from '@/utils/apis/adminApi';
import type { AdminfetchAllApplicationsResponse } from '@/types/apiTypes/admin';
import { AdminApplicationsTableColumns } from '@/components/table/tableColumns/AdminUsersTable';

const AdminApplications: React.FC = () => {
  return (
    <CommonTable<AdminfetchAllApplicationsResponse>
      fetchApiFunction={adminFetchAllPApplications}
      queryKey="applications"
      heading="Job Applications"
      description='List of job applications from users'
      column={AdminApplicationsTableColumns}
      columnsCount={5}
      dummyData={applicationsDummyData}
      showDummyData={true}
    />
  )
}

export default AdminApplications