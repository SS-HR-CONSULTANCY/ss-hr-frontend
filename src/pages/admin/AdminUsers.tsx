import React from 'react';
import { usersDummyData } from '@/utils/constants';
import CommonTable from '@/components/common/CommonTable';
import { adminFetchAllProviders } from '@/utils/apis/adminApi';
import type { AdminfetchAllUsersResponse } from '@/types/apiTypes/admin';
import { AdminUsersTableColumns } from '@/components/table/tableColumns/AdminUsersTable';

const AdminUsers: React.FC = () => {
  return (
    <CommonTable<AdminfetchAllUsersResponse>
      fetchApiFunction={adminFetchAllProviders}
      queryKey="users"
      heading="Users"
      description='List of users using application'
      column={AdminUsersTableColumns}
      columnsCount={6}
      dummyData={usersDummyData}
      showDummyData={true}
    />
  )
}

export default AdminUsers