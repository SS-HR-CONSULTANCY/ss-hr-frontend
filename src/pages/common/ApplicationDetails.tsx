import React from "react";
import Loading from "./Loading";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Briefcase, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import FormField from "@/components/form/FormFiled";
import { zodResolver } from "@hookform/resolvers/zod";
import InfoDisplay from "@/components/common/InfoDisplay";
import { applicationStatusOptions } from "@/utils/constants";
import { useForm, type SubmitHandler } from "react-hook-form";
import noProfile from "../../assets/defaultImgaes/noProfile.png";
import DataFetchingError from "@/components/common/DataFetchingError";
import { updateApplicationStatus, type UpdateApplicationStatusForm } from "@/utils/zod/adminZod";
import { adminGetApplicationById, adminUpdateApplicationStatus } from "@/utils/apis/adminApplicationApi";

const ApplicationDetails: React.FC = () => {
    const { id } = useParams();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["applicationDetails", id],
        queryFn: () => adminGetApplicationById(id as string),
        enabled: !!id,
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
    });

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        formState: { errors },
    } = useForm<UpdateApplicationStatusForm>({
        resolver: zodResolver(updateApplicationStatus),
        defaultValues: {
            status: ""
        },
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

    const onSubmit: SubmitHandler<UpdateApplicationStatusForm> = async (data) => {
        if (!id) {
            toast.error("Application Status Updating failed");
            return;
        }

        const res = await adminUpdateApplicationStatus({
            _id: id,
            status: data.status
        });

        console.log("res : ",res);

        if (res.success) {
            toast.success("Application Status Updated");
            data.status = status
        } else {
            toast.error("Application Status Updating failed");
        }
    }

    return (
        <div className="p-4">

            <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                    <Briefcase className="h-6 w-6" />
                    <h2 className="text-2xl font-semibold">Application ID {jobId?.jobUniqueId}</h2>
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
                    <form onSubmit={handleSubmit(onSubmit)} className="flex items-end space-x-2 p-2 max-1/2">
                        <FormField<UpdateApplicationStatusForm>
                            id="status"
                            label="Change Application Status"
                            type="select"
                            register={register}
                            error={errors.status?.message}
                            defaultValue={String(status ?? "")}
                            defaultSelectOptions="Application Status"
                            options={applicationStatusOptions}
                        />
                        <Button
                            disabled={isSubmitting}
                            type="submit"
                            variant="outline"
                            className="text-xs md:text-sm px-3 py-1 cursor-pointer"
                        >
                            {isSubmitting ? "Updating" : "Update"}
                        </Button>
                    </form>
                    <InfoDisplay label="Serial Number" value={userId?.serialNumber} />
                    <InfoDisplay label="Professional Status" value={userId?.professionalStatus} />
                    <InfoDisplay label="Nationaility" value={userId?.nationality} />
                    <InfoDisplay label="Gender" value={userId?.gender} />
                    <InfoDisplay label="Date Of Birth" value={userId?.dob} isDate />
                    <InfoDisplay label="Phone" value={userId?.phone} />
                    <InfoDisplay label="Phone Secondary" value={userId?.phoneTwo} />
                    <InfoDisplay label="Resume" value={userId?.resume as string} link />
                    <InfoDisplay label="LinkedIn Username" value={userId?.linkedInUsername} />
                    <InfoDisplay label="Portfolio Url" value={userId?.portfolioUrl} link />
                    <h3 className="text-lg font-semibold flex items-center gap-2 my-4">
                        <Briefcase className="h-5 w-5" /> Job Info
                    </h3>
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
