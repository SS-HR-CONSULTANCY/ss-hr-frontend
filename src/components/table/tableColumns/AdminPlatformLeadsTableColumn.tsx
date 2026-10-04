import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { ImportedCustomer } from "@/utils/apis/adminPlatformLeadsApi";

export const AdminPlatformLeadsTableColumns = (): ColumnDef<ImportedCustomer>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => <div>{row.getValue("phone") || "N/A"}</div>,
  },
  {
    accessorKey: "state",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State" />
    ),
    cell: ({ row }) => <div>{row.getValue("state") || "N/A"}</div>,
  },
  {
    accessorKey: "designations",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Designations" />
    ),
    cell: ({ row }) => {
      const designations = row.getValue("designations") as string[];
      return <div>{designations?.join(", ") || "N/A"}</div>;
    },
  },
  {
    accessorKey: "cvUrl",
    header: "Resume",
    cell: ({ row }) => {
      const cvUrl = row.getValue("cvUrl") as string;
      if (!cvUrl) return <span className="text-gray-400">No Resume</span>;
      return (
        <a 
          href={cvUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:underline flex items-center gap-1"
        >
          <Eye className="h-4 w-4" /> View
        </a>
      );
    },
  },
];
