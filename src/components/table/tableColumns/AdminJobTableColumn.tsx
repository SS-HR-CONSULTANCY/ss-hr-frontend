import dayjs from "dayjs";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { AdminfetchAllJobsResponse } from "@/types/apiTypes/adminApiTypes";

export const AdminJobsTableColumns = (
  handleViewDetails: (id: string) => void,
  handleEdit: (id: string) => void,
  handleDelete: (id: string) => void,
  deletingJobId: string | null,
): ColumnDef<AdminfetchAllJobsResponse>[] => [
  {
    accessorKey: "companyName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Company Name" />
    ),
  },
  {
    accessorKey: "designation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Position" />
    ),
  },
  {
    accessorKey: "vacancy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Openings" />
    ),
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
          onClick={() => handleViewDetails(row.original._id)}
          className="text-blue-500 cursor-pointer h-8 w-8 p-0 hover:bg-blue-500/20 hover:text-blue-500 transition-colors"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
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
              disabled={deletingJobId === row.original._id}
              className="text-red-500 cursor-pointer h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-500 transition-colors"
              title="Delete Job"
            >
              {deletingJobId === row.original._id ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent"></div>
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          }
          title="Are you sure you want to delete this job?"
          description="This action cannot be undone."
          confirmText="Delete"
          onConfirm={() => handleDelete(row.original._id)}
        />
      </div>
    ),
  },
];
