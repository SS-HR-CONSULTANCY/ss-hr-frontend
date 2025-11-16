import React from "react";
import { Plus } from "lucide-react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import CommonTable from "@/components/common/CommonTable";
import { useAdminPackages } from "@/hooks/useAdminPackages";
import type { AppDispatch, RootState } from "@/store/store";
import { getAllPackages } from "@/utils/apis/adminPackageApi";
import TablePageHeader from "@/components/common/TablePageHeader";
import { toggleAddPackageForm } from "@/store/slices/packageSlice";
import AddPackageForm from "@/components/admin/adminPackage/AddPackageForm";
import PackageDetails from "@/components/admin/adminPackage/PackageDetails";
import EditPackageForm from "@/components/admin/adminPackage/EditPackageForm";
import type { AdminfetchAllPackagesResponse } from "@/types/apiTypes/adminApiTypes";
import { AdminPackageTableColumns } from "@/components/table/tableColumns/AdminPackageTableColumns";

interface AdminPackagesProps {
  showButton?: boolean;
}

const AdminPackages: React.FC<AdminPackagesProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { handleDeletePackage, handleEditPackage, handleViewPackage } =
    useAdminPackages();
  const column = AdminPackageTableColumns(
    handleDeletePackage,
    handleEditPackage,
    handleViewPackage,
  );
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

      {isAddPackageFormOpen && <AddPackageForm />}
      {isEditPackageFormOpen && <EditPackageForm />}
      {isViewPackageDetailsOpen && <PackageDetails />}
    </>
  );
};

export default AdminPackages;
