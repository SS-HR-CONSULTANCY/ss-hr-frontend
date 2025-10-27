import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { AdminfetchAllPaymentsResponse } from "@/utils/apis/adminPaymentApi";

export const PaymentTableColumns = (
  handleDeletePayment: (paymentId: string) => void,
  handleEditPayment: (paymentId: string) => void,
  handleViewPayment: (paymentId: string) => void,
): ColumnDef<AdminfetchAllPaymentsResponse>[] => [
  {
    accessorKey: "customerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Customer" />
    ),
  },
  {
    accessorKey: "packageName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Package" />
    ),
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total" />
    ),
    cell: ({ row }) => {
      return (
        <span className="font-medium">
          ₹{row.original.totalAmount.toLocaleString()}
        </span>
      );
    },
  },
  {
    accessorKey: "paidAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid" />
    ),
    cell: ({ row }) => {
      return (
        <span className="font-medium">
          ₹{row.original.paidAmount.toLocaleString()}
        </span>
      );
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
        <span className={`font-medium ${balance > 0 ? "text-red-500" : ""}`}>
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
          case "pending":
            return "text-yellow-500";
          case "partiallypaid":
            return "text-blue-500";
          case "fullypaid":
            return "text-green-500";
          default:
            return "text-gray-500";
        }
      };

      const getStatusLabel = (status: string) => {
        switch (status) {
          case "pending":
            return "Pending";
          case "partiallypaid":
            return "Partially Paid";
          case "fullypaid":
            return "Fully Paid";
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

      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewPayment(paymentData._id)}
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditPayment(paymentData._id)}
            className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 cursor-pointer"
            title="Edit Payment"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeletePayment(paymentData._id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
            title="Delete Payment"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
