import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { AdminfetchAllPackagesResponse } from "@/types/apiTypes/adminApiTypes";

export const PackageTableColumns = (
  handleDeletePackage: (packageId: string) => void,
  handleEditPackage: (packageId: string) => void,
  handleViewPackage: (packageId: string) => void,
): ColumnDef<AdminfetchAllPackagesResponse>[] => [
  {
    accessorKey: "packageName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Package Name" />
    ),
  },
  {
    accessorKey: "packageType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Package Type" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const text = row.original.description;
      const truncatedText = text.length > 50 ? `${text.substring(0, 50)}...` : text;
      return (truncatedText);
    },
  },
  {
    accessorKey: "priceIN",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price (INR)" />
    ),
  },
  {
    accessorKey: "priceUAE",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price (AED)" />
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const packageData = row.original;
      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewPackage(packageData._id)}
            className="h-8 w-8 p-0 text-blue-500 cursor-pointer hover:bg-blue-500/20 hover:text-blue-500"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditPackage(packageData._id)}
            className="h-8 w-8 p-0 text-green-500 cursor-pointer hover:bg-green-500/20 hover:text-green-500"
            title="Edit Package"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeletePackage(packageData._id)}
            className="h-8 w-8 p-0 text-red-500 cursor-pointer hover:bg-red-500/20 hover:text-red-500"
            title="Delete Package"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];