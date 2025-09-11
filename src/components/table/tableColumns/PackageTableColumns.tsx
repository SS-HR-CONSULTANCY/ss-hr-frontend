import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AppDispatch } from "@/store/store";
import { openEditPackageForm, openViewPackageDetails } from "@/store/slices/packageSlice";
import { deletePackage } from "@/utils/apis/adminPackageApi";
import type { AdminfetchAllPackagesResponse } from "@/types/apiTypes/adminApiTypes";

export const PackageTableColumns: ColumnDef<AdminfetchAllPackagesResponse>[] = [
  {
    accessorKey: "packageName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Package Name" />
    ),
    cell: ({ row }) => {
      const packageName = row.original.packageName;
      const packageType = row.original.packageType;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-black">{packageName}</span>
          <span 
            className={`w-fit text-xs mt-1 px-2 py-1 rounded-full font-medium border ${
              packageType === 'jobpackage' 
                ? "border-blue-200 text-blue-700 bg-blue-50" 
                : "border-green-200 text-green-700 bg-green-50"
            }`}
          >
            {packageType === 'jobpackage' ? 'Job Package' : 'Tour Package'}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      const text = row.original.description;
      const truncatedText = text.length > 50 ? `${text.substring(0, 50)}...` : text;
      return (
        <span 
          className="max-w-xs cursor-pointer hover:text-blue-600" 
          title={text}
        >
          {truncatedText}
        </span>
      );
    },
  },
  {
    accessorKey: "priceIN",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price (INR)" />
    ),
    cell: ({ row }) => {
      return <span className="font-medium text-black">{row.original.priceIN}</span>;
    },
  },
  {
    accessorKey: "priceUAE",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price (AED)" />
    ),
    cell: ({ row }) => {
      return <span className="font-medium text-black">{row.original.priceUAE}</span>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const packageData = row.original;
      const dispatch = useDispatch<AppDispatch>();
      const queryClient = useQueryClient();

      const deleteMutation = useMutation({
        mutationFn: () => deletePackage(packageData._id),
        onSuccess: () => {
          toast.success("Package deleted successfully!");
          queryClient.invalidateQueries({ queryKey: ["packages"] });
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Failed to delete package");
        },
      });

      const handleView = () => {
        dispatch(openViewPackageDetails(packageData._id));
      };

      const handleEdit = () => {
        dispatch(openEditPackageForm(packageData._id));
      };

      const handleDelete = () => {
        // Custom delete confirmation with react-toastify
        const confirmToast = toast(
          ({ closeToast }) => (
            <div>
              <p className="mb-3">Are you sure you want to delete this package?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    deleteMutation.mutate();
                    closeToast();
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                >
                  Delete
                </button>
                <button
                  onClick={closeToast}
                  className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ),
          {
            position: "top-center",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: false,
            closeButton: false,
          }
        );
      };

      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleView}
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
            title="Edit Package"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Delete Package"
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];