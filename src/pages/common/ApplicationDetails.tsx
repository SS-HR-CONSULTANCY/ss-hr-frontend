import React from "react";
import Loading from "./Loading";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, User } from "lucide-react";
import InfoDisplay from "@/components/common/InfoDisplay";
import noProfile from "../../assets/defaultImgaes/noProfile.png";
import DataFetchingError from "@/components/common/DataFetchingError";
import { adminGetApplicationById } from "@/utils/apis/adminApplicationApi";

const ApplicationDetails: React.FC = () => {
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
        <div className="p-8">

            <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                    <Briefcase className="h-6 w-6" />
                    <h2 className="text-2xl font-semibold">Application Details</h2>
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${status ? "bg-opacity-10" : ""
                        }`}
                >
                    {status ? "Active" : "Cancelled"}
                </span>
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
                    <InfoDisplay label="Gender" value={userId?.gender} />
                    <InfoDisplay label="Nationaility" value={userId?.nationality} />
                    <InfoDisplay label="Professional Status" value={userId?.professionalStatus} />
                    <InfoDisplay label="Date Of Birth" value={userId?.dob} isDate />
                    <InfoDisplay label="Resume" value={userId?.resume as string} link />
                    <InfoDisplay label="LinkedIn Username" value={userId?.linkedInUsername} />
                    <InfoDisplay label="Nationality" value={userId?.nationality} />
                    <InfoDisplay label="Phone" value={userId?.phone} />
                    <InfoDisplay label="Phone Secondary" value={userId?.phoneTwo} />
                    <InfoDisplay label="Serial Number" value={userId?.serialNumber} />
                    <InfoDisplay label="Portfolio Url" value={userId?.portfolioUrl} link />
                    <InfoDisplay label="Designation" value={jobId?.designation} />
                    <InfoDisplay label="Benifits" value={jobId?.benifits} />
                    <InfoDisplay label="Company" value={jobId?.companyName} />
                    <InfoDisplay label="Created On" value={jobId?.createdAt} isDate />
                    <InfoDisplay label="Industry" value={jobId?.industry} />
                    <InfoDisplay label="Job Description" value={jobId?.jobDescription} />
                    <InfoDisplay label="Nationality" value={jobId?.nationality} />
                    <InfoDisplay label="Salary" value={jobId?.salary} />
                    <InfoDisplay label="Skills" value={jobId?.skills} />
                    <InfoDisplay label="Vacancy" value={jobId?.vacancy} />
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetails;
