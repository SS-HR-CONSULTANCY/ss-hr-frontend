import React from "react";
import AdminWebsiteMainDataForm from "@/components/admin/AdminWebsiteMainDataForm";
import AdminWebsiteAboutDataForm from "@/components/admin/AdminWebsiteAboutDataForm";
import AdminWebsiteFooterDataForm from "@/components/admin/AdminWebsiteFooterDataForm";
import AdminManagementForm from "@/components/admin/AdminManagementForm";

const AdminSettings: React.FC = () => {

    return (
        <div className="space-y-10 p-5">
            {/* Website Settings */}
            <AdminWebsiteMainDataForm />

            {/* Footer Settings */}
            <AdminWebsiteFooterDataForm />

            {/* About settings */}
            <AdminWebsiteAboutDataForm />

            {/* Admin management */}
            <AdminManagementForm />

        </div>
    );
};

export default AdminSettings;
