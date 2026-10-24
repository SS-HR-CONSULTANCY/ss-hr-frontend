import React from "react";
import { toast } from "react-toastify";
import {
  openEditTestimonialForm,
  openViewTestimonialDetails,
} from "@/store/slices/testimonialSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTestimonial, syncGoogleReviews } from "@/utils/apis/adminTestimonialApi";
import { ConfirmToast } from "@/components/table/tableColumns/ConfirmToast";

export const useAdminTestimonials = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const syncMutation = useMutation({
    mutationFn: syncGoogleReviews,
    onSuccess: (data) => {
      toast.success(data?.message || "Google reviews synced successfully!");
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: (error: any) => {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to sync Google reviews. Check your Outscraper API key in server .env.";
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (testimonialId: string) => deleteTestimonial(testimonialId),
    onSuccess: () => {
      toast.success("Testimonial deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: () => {
      toast.error("Failed to delete testimonial");
    },
  });

  const handleViewTestimonial = (testimonialId?: string) => {
    if (!testimonialId) return;
    dispatch(openViewTestimonialDetails(testimonialId));
  };

  const handleEditTestimonial = (testimonialId?: string) => {
    if (!testimonialId) return;
    dispatch(openEditTestimonialForm(testimonialId));
  };

  const handleDeleteTestimonial = (testimonialId: string) => {
    toast(
      ({ closeToast }) =>
        React.createElement(ConfirmToast, {
          message: "Are you sure you want to delete this testimonial?",
          onConfirm: () => {
            deleteMutation.mutate(testimonialId);
            closeToast();
          },
          onCancel: closeToast,
        }),
      {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        closeButton: false,
      },
    );
  };

  return {
    handleViewTestimonial,
    handleEditTestimonial,
    handleDeleteTestimonial,
    handleSyncGoogleReviews: () => syncMutation.mutate(),
    isDeleting: deleteMutation.isPending,
    isSyncing: syncMutation.isPending,
  };
};

