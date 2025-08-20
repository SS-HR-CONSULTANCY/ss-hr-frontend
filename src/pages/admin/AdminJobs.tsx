import React from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import { jobsDummyData } from '@/utils/constants';
import { adminFetchAllJobs } from '@/utils/apis/adminApi';
import CommonTable from '@/components/common/CommonTable';
import type { AdminfetchAllJobsResponse } from '@/types/apiTypes/admin';
import { AdminJobsTableColumns } from '@/components/table/tableColumns/AdminUsersTable';
import { toggleAddJobForm } from '@/store/slices/adminSlice';
import { Button } from '@/components/ui/button';

const AdminJobs: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
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
      <div className='p-4'>
        <Button variant={"outline"} onClick={() => dispatch(toggleAddJobForm())}> Add new company</Button>
      </div>
    </>
  )
}

export default AdminJobs