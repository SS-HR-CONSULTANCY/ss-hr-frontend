import React from "react";
import CommonTable from "@/components/common/CommonTable";
import { userFetchAllApplications } from "@/utils/apis/userApi";
import { useUserApplication } from "@/hooks/useUserApplication";
import type { UserFetchAllApplicationsResponse } from "@/types/apiTypes/userApiTypes";
import { UserApplicationsTableColumns } from "@/components/table/tableColumns/UserApplicationsTableColumns";

const UserApplications: React.FC = () => {

    const {
        handleUpdateJobApplication,
        // handleViewJobDetails
    } = useUserApplication();

    const columns = UserApplicationsTableColumns(
        handleUpdateJobApplication,
        // handleViewJobDetails
    );

    return (
        <CommonTable<UserFetchAllApplicationsResponse>
            fetchApiFunction={userFetchAllApplications}
            queryKey="applications"
            heading="Jobs"
            description="Lit of jobs according to the comapnies"
            column={columns}
            columnsCount={4}
        />
    );
};


export default UserApplications