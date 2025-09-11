import { toast } from "react-toastify";
import { deleteJob } from "../apis/adminJobApi";
import type { AppDispatch } from "@/store/store";
import { QueryClient } from "@tanstack/react-query";
import type { Dispatch, SetStateAction } from "react";
import { openEditJobForm, openViewDetailsModal } from "@/store/slices/jobSlice";

export const JobHandlers = (
  dispatch: AppDispatch,
  queryClient: QueryClient,
  setDeletingJobId: Dispatch<SetStateAction<string | null>>
) => {
  const handleViewDetails = (jobId: string) => {
    dispatch(openViewDetailsModal(jobId));
  };

  const handleEdit = (jobId: string) => {
    dispatch(openEditJobForm(jobId));
  };

  const handleDelete = async (jobId: string) => {
    setDeletingJobId(jobId);
    try {
      const response = await deleteJob(jobId);

      if (response.success) {
        toast.success(response.message || "Job deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      } else {
        toast.error("Failed to delete job");
      }
    } catch {
      toast.error("Error deleting job");
    } finally {
      setDeletingJobId(null);
    }
  };

  return { handleViewDetails, handleEdit, handleDelete };
};
