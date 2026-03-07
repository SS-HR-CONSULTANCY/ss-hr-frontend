import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, FileText } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { AdminfetchAllPaymentsResponse } from "@/utils/apis/adminPaymentApi";

export const AdminPaymentTableColumns = (
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
      <DataTableColumnHeader column={column} title="Category" />
    ),
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
    accessorKey: "referenceId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ref ID" />
    ),
    cell: ({ row }) => {
      return (
        <span className="font-mono text-xs truncate max-w-[100px] block">
          {row.original.referenceId || "N/A"}
        </span>
      );
    },
  },

  {
    accessorKey: "paymentProof",
    header: "Receipt",
    cell: ({ row }) => {
      const proof = row.original.paymentProof;
      return proof ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(proof, "_blank")}
          className="text-blue-500 hover:text-blue-700 p-0 h-auto flex items-center gap-1"
        >
          <FileText className="h-4 w-4" />
          <span className="text-xs text-nowrap">View</span>
        </Button>
      ) : (
        <span className="text-gray-400 text-xs italic">No Receipt</span>
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
            className="h-8 w-8 p-0 text-blue-500 cursor-pointer hover:bg-blue-500/20 hover:text-blue-500"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditPayment(paymentData._id)}
            className="h-8 w-8 p-0 text-green-500 cursor-pointer hover:bg-green-500/20 hover:text-green-500"
            title="Edit Payment"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeletePayment(paymentData._id)}
            className="h-8 w-8 p-0 text-red-500 cursor-pointer hover:bg-red-500/20 hover:text-red-500"
            title="Delete Payment"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
