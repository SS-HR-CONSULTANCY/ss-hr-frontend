import React from "react";
import AdminManagementForm from "@/components/admin/AdminManagementForm";
// import AdminWebsiteMainDataForm from "@/components/admin/AdminWebsiteMainDataForm";
// import AdminWebsiteAboutDataForm from "@/components/admin/AdminWebsiteAboutDataForm";
// import AdminWebsiteFooterDataForm from "@/components/admin/AdminWebsiteFooterDataForm";

const AdminSettings: React.FC = () => {

    return (
        <div className="space-y-10 p-5">
            {/* Website Settings */}
            {/* <AdminWebsiteMainDataForm /> */}

            {/* About settings */}
            {/* <AdminWebsiteAboutDataForm /> */}

            {/* Footer Settings */}
            {/* <AdminWebsiteFooterDataForm /> */}

            {/* Admin management */}
            <AdminManagementForm />
        </div>
    );
};

export default AdminSettings;
