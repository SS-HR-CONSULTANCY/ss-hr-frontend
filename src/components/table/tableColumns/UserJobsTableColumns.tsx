import dayjs from "dayjs";
import { Eye, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { UserfetchAllJobsResponse } from "@/types/apiTypes/userApiTypes";

export const UserJobsTableColumns = (
  handleApplyJob: (joibId: string) => void,
  handleViewJobDetails: (joibId: string) => void,
): ColumnDef<UserfetchAllJobsResponse>[] => [
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
    accessorKey: "salary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Salary (LPA)" />
    ),
  },
  {
    accessorKey: "vacancy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vacancy" />
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Added On" />
    ),
    cell: ({ row }) => {
      const date = dayjs(row.original.createdAt).format("DD MMM YYYY");
      return <span>{date}</span>;
    },
  },
  {
    accessorKey: "applied",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applied" />
    ),
    cell: ({ row }) => {
      return (
        <span className="font-semibol text-green-600 dark:text-green-400">
          {row.original.applied ? "Applied" : "Not Applied"}
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const job = row.original;
      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewJobDetails(job._id)}
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
          {!job.applied && (
            <Button
              variant="outline"
              className="text-blue-500 cursor-pointer h-8 w-8 p-0
  hover:bg-blue-100
  dark:hover:bg-blue-900
  hover:text-blue-600
  dark:hover:text-white
  transition-colors"
              onClick={() => handleApplyJob(job._id)}
              title="Apply"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      );
    },
  },
];
