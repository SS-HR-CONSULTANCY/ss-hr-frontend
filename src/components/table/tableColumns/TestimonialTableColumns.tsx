import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import type { AppDispatch } from "@/store/store";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import noProfile from '../../../assets/defaultImgaes/noProfile.png';
import { deleteTestimonial } from "@/utils/apis/adminTestimonialApi";
import type { AdminfetchAllTestimonialsResponse } from "@/types/apiTypes/adminApiTypes";
import { openEditTestimonialForm, openViewTestimonialDetails } from "@/store/slices/testimonialSlice";

export const TestimonialTableColumns: ColumnDef<AdminfetchAllTestimonialsResponse>[] = [
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
      const dispatch = useDispatch<AppDispatch>();
      const queryClient = useQueryClient();

      const deleteMutation = useMutation({
        mutationFn: () => deleteTestimonial(testimonial._id),
        onSuccess: () => {
          toast.success("Testimonial deleted successfully!");
          queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Failed to delete testimonial");
        },
      });

      const handleView = () => {
        dispatch(openViewTestimonialDetails(testimonial._id));
      };

      const handleEdit = () => {
        dispatch(openEditTestimonialForm(testimonial._id));
      };

      const handleDelete = () => {
        const confirmToast = toast(
          ({ closeToast }) => (
            <div>
              <p className="mb-3">Are you sure you want to delete this testimonial?</p>
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
            className="h-8 w-8 p-0 text-blue-500 hover:text-blue-500 hover:bg-blue-500/20 cursor-pointer"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-8 w-8 p-0 text-green-500 hover:text-green-500 hover:bg-green-500/20 cursor-pointer"
            title="Edit Testimonial"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-500 hover:bg-red-500/20 cursor-pointer"
            title="Delete Testimonial"
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];