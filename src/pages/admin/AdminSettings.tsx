import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import CommonTable from "@/components/common/CommonTable";
import { fetchAdmins } from "@/utils/apis/adminSettingsApi";
import TablePageHeader from "@/components/common/TablePageHeader";
import AdminManagementForm from "@/components/admin/AdminManagementForm";
import type { AdminFetchAllAdminsResponse } from "@/types/apiTypes/adminApiTypes";
import { AdminAdminsTableColumns } from "@/components/table/tableColumns/AdminAdminsTableColumn";
import { AdminSettingsHelper } from "@/utils/helpers/adminSettingsHelper";
import { useQueryClient } from "@tanstack/react-query";

const AdminSettings: React.FC = () => {

    const queryClient = useQueryClient();
    const { user } = useSelector((state: RootState) => state.auth);
    const [addAdmin, setAddAdmin] = useState<boolean>(false);
    const { handleDelete } = AdminSettingsHelper(queryClient);

    const columns = AdminAdminsTableColumns(handleDelete);

    if (!user) return;

    return (
        <>
            <TablePageHeader
                title="Admin Management"
                subtitle=""
                actionButton={
                    <Button
                        onClick={() => setAddAdmin(!addAdmin)}
                        variant="outline"
                    >
                        <Plus className="h-5 w-5" />
                        Add New Admin
                    </Button>
                }
            />

            {/* Admins Table */}
            <CommonTable<AdminFetchAllAdminsResponse>
                fetchApiFunction={fetchAdmins}
                queryKey="admins"
                heading="Admins"
                description=""
                column={columns}
                columnsCount={6}
                showDummyData={false}
                pageSize={10}
            />

            {addAdmin && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <AdminManagementForm role={user.role} setAddAdmin={setAddAdmin} />
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminSettings;
