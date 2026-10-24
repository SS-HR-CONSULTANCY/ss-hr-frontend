import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Star } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";

import type { AdminfetchAllTestimonialsResponse } from "@/types/apiTypes/adminApiTypes";

dayjs.extend(relativeTime);

export const AdminTestimonialTableColumns = (
  handleDeleteTestimonial: (testimonialId: string) => void,
  handleEditTestimonial: (testimonialId: string) => void,
  handleViewTestimonial: (testimonialId: string) => void,
  isDeleting: boolean,
): ColumnDef<AdminfetchAllTestimonialsResponse>[] => [
  {
    accessorKey: "clientName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reviewer" />
    ),
    cell: ({ row }) => {
      const name = row.original.clientName;
      const designation = row.original.designation || "Google Reviewer";
      return (
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-xs shrink-0 shadow-sm">
            {name?.charAt(0)?.toUpperCase() || "G"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-sm truncate">{name}</span>
            <span className="text-[11px] text-muted-foreground truncate">
              {designation}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "rating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => {
      const rating = row.original.rating ?? 5;
      return (
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < rating
                    ? "fill-[#fbbc04] text-[#fbbc04]"
                    : "fill-gray-200 text-gray-300 dark:fill-gray-700 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-[#fbbc04]">
            {rating}.0
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "testimonial",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Review" />
    ),
    cell: ({ row }) => {
      const text = row.original.testimonial;
      const truncatedText =
        text.length > 55 ? `${text.substring(0, 55)}...` : text;
      return (
        <span
          className="max-w-xs block cursor-pointer hover:text-blue-600 text-xs leading-relaxed"
          title={text}
        >
          {truncatedText}
        </span>
      );
    },
  },
  {
    accessorKey: "reviewDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Review Date & Time" />
    ),
    cell: ({ row }) => {
      const rawDate = row.original.reviewDate || row.original.createdAt;
      const formatted = dayjs(rawDate).format("DD MMM YYYY, hh:mm A");
      const relative = dayjs(rawDate).fromNow();
      return (
        <div className="flex flex-col">
          <span className="text-xs font-medium">{formatted}</span>
          <span className="text-[10px] text-muted-foreground">{relative}</span>
        </div>
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
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
            isVisible
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {isVisible ? "Visible" : "Hidden"}
        </span>
      );
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
            title="Edit Review"
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteTestimonial(testimonial._id)}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-500 hover:bg-red-500/20 cursor-pointer"
            title="Delete Review"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
