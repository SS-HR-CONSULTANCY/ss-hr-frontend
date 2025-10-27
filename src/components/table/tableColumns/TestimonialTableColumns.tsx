import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import noProfile from '../../../assets/defaultImgaes/noProfile.png';
import type { AdminfetchAllTestimonialsResponse } from "@/types/apiTypes/adminApiTypes";

export const TestimonialTableColumns = (  
  handleDeleteTestimonial: (testimonialId: string) => void,
  handleEditTestimonial: (testimonialId: string) => void,
  handleViewTestimonial: (testimonialId: string) => void,
  isDeleting: boolean,
): ColumnDef<AdminfetchAllTestimonialsResponse>[] => [
  {
    accessorKey: "clientPhoto",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Photo" />
    ),
    cell: ({ row }) => {
      const img = row.original.clientPhoto || noProfile;
      return (
        <img
          src={img}
          alt={row.original.clientName}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    },
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Client Name" />
    ),
  },
  {
    accessorKey: "designation",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Designation" />
    ),
  },
  {
    accessorKey: "testimonial",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Testimonial" />
    ),
    cell: ({ row }) => {
      const text = row.original.testimonial;
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
    accessorKey: "isVisible",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const isVisible = row.original.isVisible;
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          isVisible 
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
        }`}>
          {isVisible ? "Visible" : "Hidden"}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Added On" />
    ),
    cell: ({ row }) => {
      const date = dayjs(row.original.createdAt).format("DD MMM YYYY");
      return <span>{date}</span>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const testimonial = row.original;

      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewTestimonial(testimonial._id)}
            className="h-8 w-8 p-0 text-blue-500 hover:text-blue-500 hover:bg-blue-500/20 cursor-pointer"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditTestimonial(testimonial._id)}
            className="h-8 w-8 p-0 text-green-500 hover:text-green-500 hover:bg-green-500/20 cursor-pointer"
            title="Edit Testimonial"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteTestimonial(testimonial._id)}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-500 hover:bg-red-500/20 cursor-pointer"
            title="Delete Testimonial"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];