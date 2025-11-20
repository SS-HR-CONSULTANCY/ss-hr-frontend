import React from "react";
import {
  openEditPaymentForm,
  openViewPaymentDetails,
} from "@/store/slices/paymentSlice";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { deletePayment } from "@/utils/apis/adminPaymentApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfirmToast } from "@/components/table/tableColumns/ConfirmToast";

export const useAdminPayments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (paymentId: string) => deletePayment(paymentId),
    onSuccess: () => {
      toast.success("Payment deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: () => {
      toast.error("Failed to delete payment");
    },
  });

  const handleViewPayment = (paymentId: string) => {
    if (!paymentId) return;
    dispatch(openViewPaymentDetails(paymentId));
  };

  const handleEditPayment = (paymentId: string) => {
    if (!paymentId) return;
    dispatch(openEditPaymentForm(paymentId));
  };

  const handleDeletePayment = (paymentId: string) => {
    toast(
      ({ closeToast }) =>
        React.createElement(ConfirmToast, {
          message: "Are you sure you want to delete this payment?",
          confirmText: "Delete",
          cancelText: "Cancel",
          onConfirm: () => {
            deleteMutation.mutate(paymentId);
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
};
