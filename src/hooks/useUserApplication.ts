import { baseURL } from "@/lib/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { Job } from "@/types/entities/job";
import { useQueryClient } from "@tanstack/react-query";
import { userUpdateJobApplication } from "@/utils/apis/userApi";
import type { UserFetchAllApplicationsResponse, UserUpdateApplicationStatusRequest } from "@/types/apiTypes/userApiTypes";

export const useUserApplication = () => {

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleUpdateJobApplication = async (data: UserUpdateApplicationStatusRequest) => {
        const res = await userUpdateJobApplication(data);
        if (res.success) {
            toast.success(res.message);
            queryClient.setQueryData(['applications'], (oldApplications: UserFetchAllApplicationsResponse[] | undefined) => {
                if (!oldApplications || oldApplications.length === 0) {
                    queryClient.invalidateQueries({ queryKey: ['applications'] });
                    return oldApplications ?? [];
                }
                return oldApplications.map(application =>
                    application._id === res.data.jobId ? { ...application, status: res.data.status } : application
                );
            });
        }
    };

    const handleViewJobDetails = async (_id: Job["_id"]) => {
        navigate(`${baseURL}/user/jobs/${_id}`);
    }

    return {
        handleUpdateJobApplication,
        handleViewJobDetails
    };
}
