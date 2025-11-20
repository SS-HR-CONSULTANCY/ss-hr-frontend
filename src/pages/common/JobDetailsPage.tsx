import React from "react";
import { Briefcase } from "lucide-react";
import Loading from "@/pages/common/LoadingPage";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { userGetJobById } from "@/utils/apis/userApi";
import { adminGetJobById } from "@/utils/apis/adminJobApi";
import InfoDisplay from "../../components/common/InfoDisplay";
import DataFetchingError from "../../components/common/DataFetchingError";

interface JobDetailsPageProps {
  isAdmin?: boolean;
}

const JobDetailsPage: React.FC<JobDetailsPageProps> = ({ isAdmin }) => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () =>
      isAdmin ? adminGetJobById(id as string) : userGetJobById(id as string),
    queryKey: ["job-detail", id],
    staleTime: 1 * 60 * 1000,
    enabled: !!id,
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
        <h2 className="text-xl font-semibold mb-2">Job Not Found</h2>
        <p>The job you’re looking for doesn’t exist.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Briefcase className="h-6 w-6" />
          <h2 className="text-2xl font-semibold">Job Details</h2>
        </div>
      </div>

      {data && (
        <>
          <InfoDisplay label="Job ID" value={data.jobUniqueId} />
          {isAdmin && <InfoDisplay label="Company" value={data.companyName} />}
          <InfoDisplay label="Designation" value={data.designation} />
          <InfoDisplay label="Industry" value={data.industry} />
          <InfoDisplay label="Nationality" value={data.nationality} />
          <InfoDisplay label="Salary" value={data.salary} />
          <InfoDisplay label="Vacancy" value={data.vacancy} />
          <InfoDisplay label="Skills" value={data.skills} />
          <InfoDisplay label="JobDescription" value={data.jobDescription} />
          <InfoDisplay label="Benifits" value={data.benifits} />
          <InfoDisplay label="Posted On" value={data.createdAt} isDate />
        </>
      )}
    </div>
  );
};

export default JobDetailsPage;
