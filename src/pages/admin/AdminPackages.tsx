import React from "react";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import CommonTable from "@/components/common/CommonTable";
import type { AppDispatch, RootState } from "@/store/store";
import { getAllPackages } from "@/utils/apis/adminPackageApi";
import AddPackageForm from "@/components/admin/AddPackageForm";
import PackageDetails from "@/components/admin/PackageDetails";
import EditPackageForm from "@/components/admin/EditPackageForm";
import TablePageHeader from "@/components/common/TablePageHeader";
import { useAdminPackages } from "@/utils/hooks/useAdminPackages";
import { toggleAddPackageForm } from "@/store/slices/packageSlice";
import type { AdminfetchAllPackagesResponse } from "@/types/apiTypes/adminApiTypes";
import { PackageTableColumns } from "@/components/table/tableColumns/PackageTableColumns";

interface AdminPackagesProps {
  showButton?: boolean;
}

const AdminPackages: React.FC<AdminPackagesProps> = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { handleDeletePackage, handleEditPackage, handleViewPackage } = useAdminPackages();
  const column = PackageTableColumns(handleDeletePackage, handleEditPackage, handleViewPackage)
  const {
    isAddPackageFormOpen,
    isEditPackageFormOpen,
    isViewPackageDetailsOpen,
  } = useSelector((state: RootState) => state.package);


  return (
    <>
      <TablePageHeader
        title="Packages"
        subtitle="Job and tour packages for HR consultancy services"
        actionButton={
          <Button
            onClick={() => dispatch(toggleAddPackageForm())}
            variant="outline"
          >
            <Plus className="h-5 w-5" />
            Add New Package
          </Button>
        }
      />

      <CommonTable<AdminfetchAllPackagesResponse>
        fetchApiFunction={getAllPackages}
        queryKey="packages"
        heading=""
        description=""
        column={column}
        columnsCount={5}
        showDummyData={false}
        pageSize={10}
      />

      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {isAddPackageFormOpen && (<AddPackageForm />)}
          {isEditPackageFormOpen && (<EditPackageForm />)}
          {isViewPackageDetailsOpen && (<PackageDetails />)}
        </div>
      </div>
    </>
  );
};

export default AdminPackages;