import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { AdminFetchAllEnquiriesResponse } from "@/types/apiTypes/adminApiTypes";
import { format } from "date-fns";

export const AdminEnquiryTableColumns = (
  handleViewEnquiry: (enquiryId: string) => void,
  handleDeleteEnquiry: (enquiryId: string) => void
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
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone / WhatsApp" />
    ),
    cell: ({ row }) => {
      const phone = row.original.phone;
      if (!phone) return <span className="text-gray-400 text-sm">N/A</span>;
      
      const cleanPhone = phone.replace(/[^0-9+]/g, '');
      const message = encodeURIComponent("Hi, we are SS HR Consultancy. How can I help you?");
      const waLink = `https://wa.me/${cleanPhone}?text=${message}`;

      return (
        <a 
          href={waLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-700 visited:text-[#4682B4] dark:text-green-400 dark:hover:text-green-300 dark:visited:text-[#5c98ca] font-medium hover:underline flex items-center gap-1.5"
          title="Message on WhatsApp"
        >
          <IconBrandWhatsapp size={16} />
          {phone}
        </a>
      );
    },
  },
  {
    accessorKey: "subject",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subject" />
    ),
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteEnquiry(enquiry._id)}
            className="h-8 w-8 p-0 text-red-500 cursor-pointer hover:bg-red-500/20 hover:text-red-500"
            title="Delete Enquiry"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
