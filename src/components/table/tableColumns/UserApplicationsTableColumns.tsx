import dayjs from "dayjs";
import { Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { Application } from "@/types/entities/application";
import type { UserFetchAllApplicationsResponse, UserUpdateApplicationStatusRequest } from "@/types/apiTypes/userApiTypes";

export const UserApplicationsTableColumns = (
    handleUpdateJobApplication: (data: UserUpdateApplicationStatusRequest) => void,
    handleViewJobDetails: (_id: Application["_id"]) => void,
): ColumnDef<UserFetchAllApplicationsResponse>[] => [
        {
            accessorKey: "designation",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Designation" />
            ),
        },
        {
            accessorKey: "updatedAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status Updated" />
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
                return <span className="font-semibol text-green-600 dark:text-green-400">{row.original.status ? "Applied" : "Cancelled"}</span>;
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
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewJobDetails(application._id)}
                            className="text-blue-500 cursor-pointer h-8 w-8 p-0
  hover:bg-blue-100
  dark:hover:bg-blue-900
  hover:text-blue-600
  dark:hover:text-white
  transition-colors"
                            title="View Details"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        {application.status && (
                            <Button
                                variant="outline"
                                className="text-blue-500 cursor-pointer h-8 w-8 p-0
  hover:bg-blue-100
  dark:hover:bg-blue-900
  hover:text-blue-600
  dark:hover:text-white
  transition-colors"
                                onClick={() => handleUpdateJobApplication({_id: application._id, status: !application.status})}
                                title="Cancel Application"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                );
            },
        },
    ];
