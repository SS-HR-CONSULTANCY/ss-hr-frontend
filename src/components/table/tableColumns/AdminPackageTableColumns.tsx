import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { AdminfetchAllPackagesResponse } from "@/types/apiTypes/adminApiTypes";
import type { PackageCategoryType } from "@/types/entities/package";

const CATEGORY_LABELS: Record<PackageCategoryType, string> = {
  general: "General",
  visitvisa: "Visit Visa",
  visa: "Visa",
};

const CATEGORY_COLORS: Record<PackageCategoryType, string> = {
  general: "bg-gray-100 text-gray-700",
  visitvisa: "bg-blue-100 text-blue-700",
  visa: "bg-green-100 text-green-700",
};

export const AdminPackageTableColumns = (
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
    accessorKey: "packageCategory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      const cat = row.original.packageCategory as PackageCategoryType | undefined;
      if (!cat) return <span className="text-gray-400 text-xs">—</span>;
      return (
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CATEGORY_COLORS[cat] ?? "bg-gray-100 text-gray-700"}`}>
          {CATEGORY_LABELS[cat] ?? cat}
        </span>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => `${row.original.currency ?? ""} ${row.original.price ?? ""}`.trim(),
  },
  {
    accessorKey: "packageIncludes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Package Includes" />
    ),
    cell: ({ row }) => {
      const text = row.original.packageIncludes ?? "";
      return text.length > 60 ? `${text.substring(0, 60)}...` : text;
    },
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
