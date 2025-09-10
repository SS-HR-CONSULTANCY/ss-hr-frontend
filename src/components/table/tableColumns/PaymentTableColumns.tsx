import { Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AppDispatch } from "@/store/store";
import { openEditPaymentForm, openViewPaymentDetails } from "@/store/slices/paymentSlice";
import { deletePayment } from "@/utils/apis/adminPaymentApi";
import type { AdminfetchAllPaymentsResponse } from "@/utils/apis/adminPaymentApi";

export const PaymentTableColumns: ColumnDef<AdminfetchAllPaymentsResponse>[] = [
  {
    accessorKey: "customerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
    cell: ({ row }) => {
      const customerName = row.original.customerName;
      const packageName = row.original.packageName;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-black">{customerName}</span>
          <span className="text-xs text-gray-600 mt-1">{packageName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      return <span className="font-medium text-black">₹{row.original.totalAmount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "paidAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid" />
    ),
    cell: ({ row }) => {
      return <span className="font-medium text-green-600">₹{row.original.paidAmount.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "balanceAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance" />
    ),
    cell: ({ row }) => {
      const balance = row.original.balanceAmount;
      return (
        <span className={`font-medium ${balance > 0 ? 'text-red-600' : 'text-gray-500'}`}>
          ₹{balance.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusStyle = (status: string) => {
        switch (status) {
          case 'pending':
            return "border-yellow-200 text-yellow-700 bg-yellow-50";
          case 'partiallypaid':
            return "border-blue-200 text-blue-700 bg-blue-50";
          case 'fullypaid':
            return "border-green-200 text-green-700 bg-green-50";
          default:
            return "border-gray-200 text-gray-700 bg-gray-50";
        }
      };

      const getStatusLabel = (status: string) => {
        switch (status) {
          case 'pending':
            return 'Pending';
          case 'partiallypaid':
            return 'Partially Paid';
          case 'fullypaid':
            return 'Fully Paid';
          default:
            return status;
        }
      };

      return (
        <span 
          className={`w-fit text-xs px-2 py-1 rounded-full font-medium border ${getStatusStyle(status)}`}
        >
          {getStatusLabel(status)}
        </span>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const paymentData = row.original;
      const dispatch = useDispatch<AppDispatch>();
      const queryClient = useQueryClient();

      const deleteMutation = useMutation({
        mutationFn: () => deletePayment(paymentData._id),
        onSuccess: () => {
          toast.success("Payment deleted successfully!");
          queryClient.invalidateQueries({ queryKey: ["payments"] });
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Failed to delete payment");
        },
      });

      const handleView = () => {
        dispatch(openViewPaymentDetails(paymentData._id));
      };

      const handleEdit = () => {
        dispatch(openEditPaymentForm(paymentData._id));
      };

      const handleDelete = () => {
        // Custom delete confirmation with react-toastify
        const confirmToast = toast(
          ({ closeToast }) => (
            <div>
              <p className="mb-3">Are you sure you want to delete this payment?</p>
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
            title="Edit Payment"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Delete Payment"
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];