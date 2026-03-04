import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { AdminFetchAllEnquiriesResponse } from "@/types/apiTypes/adminApiTypes";
import { format } from "date-fns";

export const AdminEnquiryTableColumns = (
  handleViewEnquiry: (enquiryId: string) => void,
): ColumnDef<AdminFetchAllEnquiriesResponse>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return format(new Date(row.original.createdAt), "dd MMM yyyy, p");
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const { firstName, lastName } = row.original;
      return `${firstName} ${lastName}`;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "subject",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subject" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            status === "unread"
              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
              : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const enquiry = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewEnquiry(enquiry._id)}
            className="h-8 w-8 p-0 text-blue-500 cursor-pointer hover:bg-blue-500/20 hover:text-blue-500"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
