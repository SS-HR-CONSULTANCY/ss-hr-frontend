import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { AdminfetchAllUsersResponse } from "@/types/apiTypes/adminApiTypes";

export const AdminUserTableColumns = (
  handleDelete: (id: string) => void,
  handleEdit: (id: string) => void,
  handleViewDetails: (id: string) => void,
): ColumnDef<AdminfetchAllUsersResponse>[] => [
  {
    accessorKey: "serialNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Serial No." />
    ),
    cell: ({ row }) => {
      const serialNumber = row.getValue("serialNumber") as string;
      return (
        <div className="font-medium">
          {serialNumber || row.original.serialNumber || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("fullName")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "isVerified",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Verified" />
    ),
    cell: ({ row }) => {
      const isVerified = row.getValue("isVerified");
      return isVerified ? "Yes" : "No";
    },
  },
  {
    accessorKey: "isBlocked",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isBlocked = row.getValue("isBlocked");
      return isBlocked ? "Blocked" : "Active";
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
          onClick={() => handleViewDetails(row.original._id)}
          className="text-blue-500 cursor-pointer h-8 w-8 p-0 hover:bg-blue-500/20 hover:text-blue-500 transition-colors"
          title="View Details"
        >
          <Eye className="h-4 w-4 " />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEdit(row.original._id)}
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
          title="Are you sure you want to delete this user?"
          description="This action cannot be undone."
          confirmText="Delete"
          onConfirm={() => handleDelete(row.original._id)}
        />
      </div>
    ),
  },
];
