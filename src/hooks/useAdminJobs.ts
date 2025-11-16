import React from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "@/store/store";
import { deleteJob } from "@/utils/apis/adminJobApi";
import { openEditJobForm } from "@/store/slices/jobSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfirmToast } from "@/components/table/tableColumns/ConfirmToast";

export const useAdminJobs = () => {

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (packageId: string) => deleteJob(packageId),
        onSuccess: () => {
            toast.success("Job deleted successfully!");
            queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
        },
        onError: () => {
            toast.error("Failed to delete job");
        },
    });

    const handleViewDetails = (jobId: string) => {
        navigate(`/ss-hr-admin/jobs/${jobId}`);
    };

    const handleEdit = (jobId: string) => {
        dispatch(openEditJobForm(jobId));
    };

    const handleDelete = (packageId: string) => {
        toast(
            ({ closeToast }) =>
                React.createElement(ConfirmToast, {
                    message: "Are you sure you want to delete this job?",
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


    return { handleViewDetails, handleEdit, handleDelete };
};
