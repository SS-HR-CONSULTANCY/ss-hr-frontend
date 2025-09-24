import dayjs from "dayjs";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { AdminFetchAllAdminsResponse } from "@/types/apiTypes/adminApiTypes";

export const AdminAdminsTableColumns = (
    // handleViewDetails: (id: string) => void,
    // handleEdit: (id: string) => void,
    handleDelete: (id: string) => void,
): ColumnDef<AdminFetchAllAdminsResponse>[] => [
        {
            accessorKey: "fullName",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Name" />
            ),
        },
        {
            accessorKey: "email",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Email" />
            ),
        },
        {
            accessorKey: "role",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Role" />
            ),
        },
        {
            accessorKey: "isVerified",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Verified" />,
            cell: ({ row }) => {
                const isVerified = row.getValue("isVerified");
                return (isVerified ? 'Yes' : 'No');
            },
        },
        {
            accessorKey: "isBlocked",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            cell: ({ row }) => {
                const isBlocked = row.getValue("isBlocked");
                return (isBlocked ? 'Blocked' : 'Active');
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Posted On" />
            ),
            cell: ({ row }) => {
                const date = dayjs(row.original.createdAt).format("DD MMM YYYY");
                return <span>{date}</span>;
            },
        },
        {
            accessorKey: "actions",
            header: "Actions",
            id: "actions",
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        // onClick={() => handleEdit(row.original._id)}
                        className="text-green-500 cursor-pointer h-8 w-8 p-0 hover:bg-green-500/20 hover:text-green-500 transition-colors"
                        title="Edit Job"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <ConfirmDialog
                        trigger={
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 cursor-pointer h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-500 transition-colors"
                                title="Delete Job"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        }
                        title="Are you sure you want to delete this admin?"
                        description="This action cannot be undone."
                        confirmText="Delete"
                        onConfirm={() => handleDelete(row.original._id)}
                    />
                </div>
            ),
        },
    ];
