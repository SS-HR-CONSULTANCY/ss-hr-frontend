import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { UserfetchAllJobsResponse } from "@/types/apiTypes/userApiTypes";

export const UserJobsTableColumns = (
  handleApplyJob: (joibId: string) => void,
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
    accessorKey: "actions",
    header: "Action",
    id: "actions",
    cell: ({ row }) => {
      const job = row.original;
      return (
        <div className="flex items-center space-x-2">
          {job.applied ? (
            <span className="font-semibold text-green-600 dark:text-green-400">
              Applied
            </span>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="text-white bg-blue-600 hover:bg-blue-700 cursor-pointer h-8 px-4
  transition-colors"
              onClick={() => handleApplyJob(job._id)}
            >
              Apply
            </Button>
          )}
        </div>
      );
    },
  },
];
