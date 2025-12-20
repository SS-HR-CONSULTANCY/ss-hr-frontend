import dayjs from "dayjs";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { AdminfetchAllApplicationsResponse } from "@/types/apiTypes/adminApiTypes";

export const AdminApplicationsTableColumns = (
  handleViewApplicationDetails: (applicationId: string) => void,
): ColumnDef<AdminfetchAllApplicationsResponse>[] => [
  {
    accessorKey: "applicationUniqueId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Application ID" />
    ),
  },
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applicant Name" />
    ),
  },
  {
    accessorKey: "jobUniqueId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Job ID" />
    ),
  },
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
      const status = row.original.status;
      const statusStyles: Record<string, { label: string; color: string }> = {
        applied: {
          label: "Applied",
          color: "text-blue-600 dark:text-blue-400",
        },
        reviewing: {
          label: "Reviewing",
          color: "text-yellow-600 dark:text-yellow-400",
        },
        rejected: {
          label: "Rejected",
          color: "text-red-600 dark:text-red-400",
        },
        placed: {
          label: "Placed",
          color: "text-green-600 dark:text-green-400",
        },
        cancelledByUser: {
          label: "Cancelled",
          color: "text-gray-600 dark:text-gray-400",
        },
      };

      const style = status
        ? (statusStyles[status] ?? { label: status, color: "" })
        : { label: "—", color: "" };

      return (
        <span className={`font-semibold capitalize ${style.color}`}>
          {style.label}
        </span>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applied On" />
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
