import React from 'react';
import { jobsDummyData } from '@/utils/constants';
import { adminFetchAllJobs } from '@/utils/apis/adminApi';
import CommonTable from '@/components/common/CommonTable';
import type { AdminfetchAllJobsResponse } from '@/types/apiTypes/admin';
import { AdminJobsTableColumns } from '@/components/table/tableColumns/AdminUsersTable';

const AdminJobs: React.FC = () => {

 

  return (
     <CommonTable<AdminfetchAllJobsResponse>
      fetchApiFunction={adminFetchAllJobs}
      queryKey="jobs"
      heading="Jobs"
      description='Lit of jobs according to the comapnies'
      column={AdminJobsTableColumns}
      columnsCount={4}
      dummyData={jobsDummyData}
      showDummyData={true}
    />
  )
}

export default AdminJobs