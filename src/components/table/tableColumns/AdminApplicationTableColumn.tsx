import dayjs from "dayjs";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { AdminfetchAllApplicationsResponse } from "@/types/apiTypes/adminApiTypes";

export const AdminApplicationsTableColumns = (
    handleViewApplicationDetails: (applicationId: string) => void,
):
    ColumnDef<AdminfetchAllApplicationsResponse>[] =>
    [
        {
            accessorKey: "companyName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Company" />
            ),
        },
        {
            accessorKey: "designation",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Designation" />
            ),
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
            accessorKey: "updatedAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Applient On" />
            ),
            cell: ({ row }) => {
                const date = dayjs(row.original.updatedAt).format("DD MMM YYYY");
                return <span>{date}</span>;
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
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewApplicationDetails(application._id)}
                            className="text-blue-500 cursor-pointer h-8 w-8 p-0 hover:bg-blue-500/20 hover:text-blue-500 transition-colors"
                            title="View Details"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];
