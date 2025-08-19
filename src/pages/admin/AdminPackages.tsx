import React from 'react';
import { packageDummyData } from '@/utils/constants';
import CommonTable from '@/components/common/CommonTable';
import { adminFetchAllPackages } from '@/utils/apis/adminApi';
import type { AdminfetchAllPackagesResponse } from '@/types/apiTypes/admin';
import { AdminPackagesTableColumns } from '@/components/table/tableColumns/AdminUsersTable';

const AdminPackages: React.FC = () => {
  return (
     <CommonTable<AdminfetchAllPackagesResponse>
      fetchApiFunction={adminFetchAllPackages}
      queryKey="packages"
      heading="Companies"
      description='List of companies listed in application'
      column={AdminPackagesTableColumns}
      columnsCount={5}
      dummyData={packageDummyData}
      showDummyData={true}
    />
  )
}

export default AdminPackages