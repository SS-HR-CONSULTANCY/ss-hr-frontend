import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { AdminfetchAllJobsResponse } from "@/types/apiTypes/adminApiTypes";

export const AdminJobsTableColumns = (
  handleViewDetails: (id: string) => void,
  handleEdit: (id: string) => void,
  handleDelete: (id: string) => void,
): ColumnDef<AdminfetchAllJobsResponse>[] => [
  {
    accessorKey: "jobUniqueId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Job ID" />
    ),
  },
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDelete(row.original._id)}
          className="h-8 w-8 p-0 text-red-500 cursor-pointer hover:bg-red-500/20 hover:text-red-500"
          title="Delete Job"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
