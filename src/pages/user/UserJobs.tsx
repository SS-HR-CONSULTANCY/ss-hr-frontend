import React from "react";
import { useUserJob } from "@/hooks/useUserJob";
import { userFetchAllJobs } from "@/utils/apis/userApi";
import CommonTable from "@/components/common/CommonTable";
import type { UserfetchAllJobsResponse } from "@/types/apiTypes/userApiTypes";
import { UserJobsTableColumns } from "@/components/table/tableColumns/UserJobsTableColumns";

const UserJobs: React.FC = () => {
  const { handleApplyJob } = useUserJob();

  const columns = UserJobsTableColumns(handleApplyJob);

  return (
    <CommonTable<UserfetchAllJobsResponse>
      fetchApiFunction={userFetchAllJobs}
      queryKey="jobs"
      heading="Jobs"
      description="Lit of jobs according to the comapnies"
      column={columns}
      columnsCount={4}
    />
  );
};

export default UserJobs;
