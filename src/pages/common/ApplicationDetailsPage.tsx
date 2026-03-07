import React from "react";
import Loading from "./LoadingPage";
import { useParams } from "react-router-dom";
import { Briefcase, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import InfoDisplay from "@/components/common/InfoDisplay";
import noProfile from "../../assets/defaultImgaes/noProfile.png";
import DataFetchingError from "@/components/common/DataFetchingError";
import {
  adminGetApplicationById,
} from "@/utils/apis/adminApplicationApi";

const ApplicationDetailsPage: React.FC = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["applicationDetails", id],
    queryFn: () => adminGetApplicationById(id as string),
    enabled: !!id,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <Loading />;

  if (isError && error) {
    return <DataFetchingError message="Failed to fetch application details." />;
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <Briefcase className="h-10 w-10 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Application Not Found</h2>
        <p>The application you’re looking for doesn’t exist.</p>
      </div>
    );
  }

  const { jobId, userId, status } = data;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Briefcase className="h-6 w-6" />
          <h2 className="text-2xl font-semibold">
            Application ID {jobId?.jobUniqueId}
          </h2>
        </div>
      </div>

      <div className="w-full mt-2">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5" /> Applicant Info
          </h3>

          <div className="flex items-center gap-4">
            <img
              src={userId?.profileImage ?? noProfile}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-semibold">
                {userId?.fullName || "Unknown User"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <InfoDisplay label="Application Status" value={status} />

          <h3 className="text-lg font-semibold flex items-center gap-2 my-4">
            <Briefcase className="h-5 w-5" /> Job Info
          </h3>
          <InfoDisplay label="Designation" value={jobId?.designation} />
          <InfoDisplay label="Company" value={jobId?.companyName} />
          <InfoDisplay label="Job ID" value={jobId?.jobUniqueId} />
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;
