import React from 'react';
import { companiesDummyData } from '@/utils/constants';
import CommonTable from '@/components/common/CommonTable';
import { adminFetchAllCompanies } from '@/utils/apis/adminApi';
import type { AdminfetchAllComapniesResponse } from '@/types/apiTypes/admin';
import { AdminCompaniesTableColumns } from '@/components/table/tableColumns/AdminUsersTable';

const AdminCompanies:React.FC = () => {
  return (
    <CommonTable<AdminfetchAllComapniesResponse>
      fetchApiFunction={adminFetchAllCompanies}
      queryKey="companies"
      heading="Companies"
      description='List of companies listed in application'
      column={AdminCompaniesTableColumns}
      columnsCount={5}
      dummyData={companiesDummyData}
      showDummyData={true}
    />
  )
}

export default AdminCompanies