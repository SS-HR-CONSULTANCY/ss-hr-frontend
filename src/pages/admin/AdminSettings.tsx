import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import AdminManagementForm from "@/components/admin/AdminManagementForm";

// import AdminWebsiteMainDataForm from "@/components/admin/AdminWebsiteMainDataForm";
// import AdminWebsiteAboutDataForm from "@/components/admin/AdminWebsiteAboutDataForm";
// import AdminWebsiteFooterDataForm from "@/components/admin/AdminWebsiteFooterDataForm";

const AdminSettings: React.FC = () => {

    const { user } = useSelector((state: RootState) => state.auth);
    if(!user) return;

    return (
        <div className="space-y-10 p-5">
            {/* Website Settings */}
            {/* <AdminWebsiteMainDataForm /> */}

            {/* About settings */}
            {/* <AdminWebsiteAboutDataForm /> */}

            {/* Footer Settings */}
            {/* <AdminWebsiteFooterDataForm /> */}

            {/* Admin management */}
            <AdminManagementForm role={user.role} />
        </div>
    );
};

export default AdminSettings;
