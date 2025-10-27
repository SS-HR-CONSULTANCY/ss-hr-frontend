import React from "react";
import { toast } from "react-toastify";
import {
  openEditPackageForm,
  openViewPackageDetails,
} from "@/store/slices/packageSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { deletePackage } from "@/utils/apis/adminPackageApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfirmToast } from "@/components/table/tableColumns/ConfirmToast";

export function useAdminPackages() {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (packageId: string) => deletePackage(packageId),
    onSuccess: () => {
      toast.success("Package deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
    onError: () => {
      toast.error("Failed to delete package");
    },
  });

  const handleViewPackage = (packageId: string) => {
    dispatch(openViewPackageDetails(packageId));
  };

  const handleEditPackage = (packageId: string) => {
    dispatch(openEditPackageForm(packageId));
  };

  const handleDeletePackage = (packageId: string) => {
    toast(
      ({ closeToast }) =>
        React.createElement(ConfirmToast, {
          message: "Are you sure you want to delete this package?",
          confirmText: "Delete",
          cancelText: "Cancel",
          onConfirm: () => {
            deleteMutation.mutate(packageId);
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
    handleViewPackage,
    handleEditPackage,
    handleDeletePackage,
  };
}
