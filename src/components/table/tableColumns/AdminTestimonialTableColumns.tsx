import React, { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2, Star, X } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { AdminfetchAllTestimonialsResponse } from "@/types/apiTypes/adminApiTypes";

dayjs.extend(relativeTime);

interface ReviewCommentCellProps {
  text: string;
  reviewerName?: string;
  onViewDetails?: () => void;
}

const ReviewCommentCell: React.FC<ReviewCommentCellProps> = ({
  text,
  reviewerName,
  onViewDetails,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const trimmed = (text || "").trim();

  if (!trimmed) {
    return (
      <span className="text-gray-400 dark:text-gray-500 text-xs italic select-none">
        —
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1.5 max-w-[260px] md:max-w-[320px] w-full">
      <span
        className="truncate text-xs text-gray-700 dark:text-gray-300 flex-1 block leading-relaxed"
        title={trimmed}
      >
        {trimmed}
      </span>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="p-1 rounded text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 shrink-0 transition-colors cursor-pointer"
            title="View full review comment"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={6}
          className="w-80 sm:w-96 p-4 shadow-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 rounded-xl z-50 animate-in fade-in-0 zoom-in-95"
        >
          <div className="relative pt-0 pb-1">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute -top-1 -right-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-2 pr-6">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Full Review
              </span>
              {reviewerName && (
                <span className="text-xs text-gray-400 font-normal truncate">
                  • {reviewerName}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed max-h-[260px] overflow-y-auto whitespace-pre-wrap break-words select-text p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
              "{trimmed}"
            </div>
            {onViewDetails && (
              <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    onViewDetails();
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View All Details
                </button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const AdminTestimonialTableColumns = (
  handleDeleteTestimonial: (testimonialId: string) => void,
  handleEditTestimonial: (testimonialId: string) => void,
  handleViewTestimonial: (testimonialId: string) => void,
  isDeleting: boolean,
): ColumnDef<AdminfetchAllTestimonialsResponse>[] => [
  {
    accessorKey: "clientName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Reviewer"
        className="justify-start text-left pl-1"
      />
    ),
    cell: ({ row }) => {
      const name = row.original.clientName;
      const rawDesignation = row.original.designation;
      const designation =
        rawDesignation &&
        rawDesignation.trim() !== "Client of SS HR Tours & Travels"
          ? rawDesignation.trim()
          : null;
      const photo = row.original.clientPhoto;
      return (
        <div className="flex items-center gap-2.5 text-left w-full pl-1">
          {photo ? (
            <img
              src={photo}
              alt={name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover shrink-0 shadow-sm border border-zinc-200 dark:border-zinc-700"
              onError={(e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.display = "none";
                const sibling = target.nextElementSibling as HTMLElement;
                if (sibling) {
                  sibling.style.display = "flex";
                  sibling.classList.remove("hidden");
                }
              }}
            />
          ) : null}
          <div
            className={`items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-semibold text-xs shrink-0 shadow-sm ${
              photo ? "hidden" : "flex"
            }`}
          >
            {name?.charAt(0)?.toUpperCase() || "G"}
          </div>
          <div className="flex flex-col min-w-0 text-left">
            <span className="font-medium text-sm truncate">{name}</span>
            {designation && (
              <span className="text-[11px] text-muted-foreground truncate">
                {designation}
              </span>
            )}
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
    cell: ({ row }) => (
      <ReviewCommentCell
        text={row.original.testimonial}
        reviewerName={row.original.clientName}
        onViewDetails={() => handleViewTestimonial(row.original._id)}
      />
    ),
  },
  {
    accessorKey: "reviewDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Review Date & Time" />
    ),
    cell: ({ row }) => {
      const rawDate = row.original.reviewDate || row.original.createdAt;
      const formatted = rawDate
        ? dayjs(rawDate).format("DD MMM YYYY, hh:mm A")
        : "-";
      return (
        <span className="text-xs font-medium whitespace-nowrap">
          {formatted}
        </span>
      );
    },
  },
  {
    id: "timeAgo",
    accessorFn: (row) => row.reviewDate || row.createdAt,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Posted" />
    ),
    cell: ({ row }) => {
      const rawDate = row.original.reviewDate || row.original.createdAt;
      const relative = rawDate ? dayjs(rawDate).fromNow() : "-";
      return (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {relative}
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
