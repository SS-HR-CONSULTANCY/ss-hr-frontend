import { baseURL } from "@/lib/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { userApplyJob } from "@/utils/apis/userApi";
import { useQueryClient } from "@tanstack/react-query";
import type { UserfetchAllJobsResponse } from "@/types/apiTypes/userApiTypes";
import type { Job } from "@/types/entities/job";

export const useUserJob = () => {

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const handleApplyJob = async (_id: Job["_id"]) => {
        const res = await userApplyJob(_id);
        if (res.success) {
            toast.success(res.message);
            queryClient.setQueryData(['jobs'], (oldJobs: UserfetchAllJobsResponse[] | undefined) => {
                if (!oldJobs) return [];
                return oldJobs.map(job =>
                    job._id === res.data.jobId ? { ...job, applied: res.data.status } : job
                );
            });
        }
    };

    const handleViewJobDetails = async (_id: Job["_id"]) => {
        navigate(`${baseURL}/user/jobs/${_id}`);
    }

    return {
        handleApplyJob,
        handleViewJobDetails,
    };
}
