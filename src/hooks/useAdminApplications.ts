import { useNavigate } from "react-router-dom";

export const useAdminApplications = () => {
  const navigate = useNavigate();

  const handleViewApplicationDetails = (applicationId: string) => {
    navigate(`/ss-hr-admin/applications/${applicationId}`);
  };

  return {
    handleViewApplicationDetails,
  };
};
