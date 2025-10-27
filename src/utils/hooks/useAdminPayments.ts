import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import type { AppDispatch } from "@/store/store";
import { deletePayment } from "@/utils/apis/adminPaymentApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfirmToast } from "@/components/table/tableColumns/ConfirmToast";
import {
  openEditPaymentForm,
  openViewPaymentDetails,
} from "@/store/slices/paymentSlice";

export function useAdminPayments(paymentId?: string) {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deletePayment(paymentId!),
    onSuccess: () => {
      toast.success("Payment deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: () => {
      toast.error("Failed to delete payment");
    },
  });

  const handleViewPayment = () => {
    if (!paymentId) return;
    dispatch(openViewPaymentDetails(paymentId));
  };

  const handleEditPayment = () => {
    if (!paymentId) return;
    dispatch(openEditPaymentForm(paymentId));
  };

  const handleDeletePayment = () => {
    toast(
      ({ closeToast }) =>
        React.createElement(ConfirmToast, {
          message: "Are you sure you want to delete this payment?",
          confirmText: "Delete",
          cancelText: "Cancel",
          onConfirm: () => {
            deleteMutation.mutate();
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
    handleViewPayment,
    handleEditPayment,
    handleDeletePayment,
    isDeleting: deleteMutation.isPending,
  };
}
