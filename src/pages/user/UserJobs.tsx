import React from 'react';
import { jobsDummyData } from '@/utils/dummyData';
import CommonTable from '@/components/common/CommonTable';
import { userFetchAllJobs } from '@/utils/apis/user/userApi';
import type { UserfetchAllJobsResponse } from '@/types/apiTypes/user';
import { UserJobsTableColumns } from '@/components/table/tableColumns/UserTableColumns';

const UserJobs: React.FC = () => {
    return (
        <CommonTable<UserfetchAllJobsResponse>
            fetchApiFunction={userFetchAllJobs}
            queryKey="jobs"
            heading="Jobs"
            description='Lit of jobs according to the comapnies'
            column={UserJobsTableColumns}
            columnsCount={4}
            dummyData={jobsDummyData}
            showDummyData={true}
        />
    )
}

export default UserJobs