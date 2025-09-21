import React from 'react';
import { jobsDummyData } from '@/utils/dummyData';
import { userFetchAllJobs } from '@/utils/apis/userApi';
import CommonTable from '@/components/common/CommonTable';
import type { UserfetchAllJobsResponse } from '@/types/apiTypes/userApiTypes';
import { UserJobsTableColumns } from '@/components/table/tableColumns/UserJobsColumns';

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