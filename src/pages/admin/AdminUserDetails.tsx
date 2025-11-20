import React from "react";
import Loading from "../common/LoadingPage";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, MapPin, User } from "lucide-react";
import InfoDisplay from "@/components/common/InfoDisplay";
import noProfile from "../../assets/defaultImgaes/noProfile.png";
import { adminGetUserDetailsId } from "@/utils/apis/adminUserApi";
import DataFetchingError from "@/components/common/DataFetchingError";

const AdminUserDetails: React.FC = () => {
  const { id } = useParams();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userDetails", id],
    queryFn: () => adminGetUserDetailsId(id as string),
    enabled: !!id,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <Loading />;

  if (isError && error) {
    return <DataFetchingError message="Failed to fetch user details." />;
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <User className="h-10 w-10 mb-4" />
        <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
        <p>The user you’re looking for doesn’t exist.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-8">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="h-5 w-5" /> User Info
        </h3>

        <div className="flex items-center gap-4">
          <img
            src={data?.userData?.profileImage ?? noProfile}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-semibold">
              {data?.userData?.fullName || "Unknown User"}
            </p>
            <p className="text-sm">{data?.userData?.email || "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="space-y-1 mt-4">
        <InfoDisplay label="Gender" value={data?.userData?.gender} />
        <InfoDisplay label="Nationality" value={data?.userData?.nationality} />
        <InfoDisplay
          label="Professional Status"
          value={data?.userData?.professionalStatus}
        />
        <InfoDisplay label="Date of Birth" value={data?.userData?.dob} isDate />
        <InfoDisplay
          label="Resume"
          value={data?.userData?.resume as string}
          link
        />
        <InfoDisplay
          label="LinkedIn Username"
          value={data?.userData?.linkedInUsername}
        />
        <InfoDisplay label="Phone" value={data?.userData?.phone} />
        <InfoDisplay
          label="Phone (Secondary)"
          value={data?.userData?.phoneTwo}
        />
        <InfoDisplay
          label="Portfolio URL"
          value={data?.userData?.portfolioUrl}
          link
        />
        <InfoDisplay
          label="Serial Number"
          value={data?.userData?.serialNumber}
        />
      </div>

      {data?.address && (
        <div className="space-y-1 mt-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5" /> Address
          </h3>
          <InfoDisplay
            label="Address Line 1"
            value={data.address.addressLine1}
          />
          <InfoDisplay
            label="Address Line 2"
            value={data.address.addressLine2}
          />
          <InfoDisplay label="City" value={data.address.city} />
          <InfoDisplay label="District" value={data.address.district} />
          <InfoDisplay label="State" value={data.address.state} />
          <InfoDisplay label="Country" value={data.address.country} />
          <InfoDisplay label="Postal Code" value={data.address.postalCode} />
          <InfoDisplay label="Landmark" value={data.address.landmark} />
        </div>
      )}

      {/* Career Info (optional) */}
      {data?.careerData && (
        <div className="space-y-1 mt-6">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Briefcase className="h-5 w-5" /> Career Info
          </h3>
          <InfoDisplay
            label="Current Company"
            value={data.careerData.currentCompany}
          />
          <InfoDisplay
            label="Designation"
            value={data.careerData.currentDesignation}
          />
          <InfoDisplay label="Industry" value={data.careerData.industry} />
          <InfoDisplay label="Experience" value={data.careerData.experience} />
          <InfoDisplay
            label="Current Salary"
            value={data.careerData.currentSalary}
          />
          <InfoDisplay
            label="Expected Salary"
            value={data.careerData.expectedSalary}
          />
          <InfoDisplay
            label="Job Type"
            value={data.careerData.currentJobType}
          />
          <InfoDisplay
            label="Preferred Job Types"
            value={data.careerData.preferredJobTypes?.join(", ")}
          />
          <InfoDisplay
            label="Preferred Work Modes"
            value={data.careerData.preferredWorkModes?.join(", ")}
          />
          <InfoDisplay
            label="Immediate Joiner"
            value={data.careerData.immediateJoiner ? "Yes" : "No"}
          />
          <InfoDisplay
            label="Notice Period"
            value={data.careerData.noticePeriod}
          />
        </div>
      )}
    </div>
  );
};

export default AdminUserDetails;
