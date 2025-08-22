import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import type { AppDispatch } from '@/store/store';
import { jobsDummyData } from '@/utils/dummyData';
import { adminFetchAllJobs } from '@/utils/apis/adminApi';
import CommonTable from '@/components/common/CommonTable';
import { toggleAddJobForm } from '@/store/slices/adminSlice';
import type { AdminfetchAllJobsResponse } from '@/types/apiTypes/admin';
import { AdminJobsTableColumns } from '@/components/table/tableColumns/AdminUsersTable';

interface Sample {
  showButton?: boolean;
}

const AdminJobs: React.FC<Sample> = ({
  showButton
}) => {

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
      {showButton && (
        <div className='p-4'>
        <Button variant={"outline"} onClick={() => dispatch(toggleAddJobForm())}> Add new company</Button>
      </div>
      )}
    </>
  )
}

export default AdminJobs