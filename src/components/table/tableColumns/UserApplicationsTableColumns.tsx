import dayjs from "dayjs";
import { RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { applicationStatusValues } from "@/utils/constants";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
// import type { Application } from "@/types/entities/application";
import type { UserFetchAllApplicationsResponse, UserUpdateApplicationStatusRequest } from "@/types/apiTypes/userApiTypes";

export const UserApplicationsTableColumns = (
    handleUpdateJobApplication: (data: UserUpdateApplicationStatusRequest) => void,
    // handleViewJobDetails: (_id: Application["_id"]) => void,
): ColumnDef<UserFetchAllApplicationsResponse>[] => [
        {
            accessorKey: "applicationUniqueId",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Application ID" />
            ),
        },
        {
            accessorKey: "jobUniqueId",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Job ID" />
            ),
        },
        {
            accessorKey: "designation",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Designation" />
            ),
        },
        {
            accessorKey: "updatedAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="updated On" />
            ),
            cell: ({ row }) => {
                const date = dayjs(row.original.updatedAt).format("DD MMM YYYY");
                return <span>{date}</span>;
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                const status = row.original.status;
                const statusStyles: Record<
                    string,
                    { label: string; color: string }
                > = {
                    applied: { label: "Applied", color: "text-blue-600 dark:text-blue-400" },
                    reviewing: { label: "Reviewing", color: "text-yellow-600 dark:text-yellow-400" },
                    rejected: { label: "Rejected", color: "text-red-600 dark:text-red-400" },
                    placed: { label: "Placed", color: "text-green-600 dark:text-green-400" },
                    cancelledByUser: { label: "Cancelled", color: "text-gray-600 dark:text-gray-400" },
                };

                const style = status ? statusStyles[status] ?? { label: status, color: "" } : { label: "—", color: "" };

                return (
                    <span className={`font-semibold capitalize ${style.color}`}>
                        {style.label}
                    </span>
                );
            },
        },
        {
            accessorKey: "actions",
            header: "Actions",
            id: "actions",
            cell: ({ row }) => {
                const application = row.original;
                return (
                    <div className="flex items-center space-x-2">
                        {application.status === applicationStatusValues[0] && ( // applied
                            <Button
                                variant="outline"
                                className="text-red-500 cursor-pointer h-8 w-8 p-0
        hover:bg-red-100
        dark:hover:bg-red-900
        hover:text-red-600
        dark:hover:text-white
        transition-colors"
                                onClick={() =>
                                    handleUpdateJobApplication({
                                        _id: application._id,
                                        status: applicationStatusValues[1],
                                    })
                                }
                                title="Cancel Application"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}

                        {application.status === applicationStatusValues[1] && ( 
                            <Button
                                variant="outline"
                                className="text-green-500 cursor-pointer h-8 w-8 p-0
        hover:bg-green-100
        dark:hover:bg-green-900
        hover:text-green-600
        dark:hover:text-white
        transition-colors"
                                onClick={() =>
                                    handleUpdateJobApplication({
                                        _id: application._id,
                                        status: applicationStatusValues[0],
                                    })
                                }
                                title="Reapply"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                );
            },
        },
    ];
