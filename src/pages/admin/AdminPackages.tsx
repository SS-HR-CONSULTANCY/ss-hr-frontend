import React from "react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "@/components/common/CommonTable";
import type { AppDispatch, RootState } from "@/store/store";
import { getAllPackages } from "@/utils/apis/adminPackageApi";
import AddPackageForm from "@/components/admin/AddPackageForm";
import PackageDetails from "@/components/admin/PackageDetails";
import EditPackageForm from "@/components/admin/EditPackageForm";
import { toggleAddPackageForm } from "@/store/slices/packageSlice";
import type { AdminfetchAllPackagesResponse } from "@/types/apiTypes/adminApiTypes";
import { PackageTableColumns } from "@/components/table/tableColumns/PackageTableColumns";
import TablePageHeader from "@/components/common/TablePageHeader";
import { Plus } from "lucide-react";

interface AdminPackagesProps {
  showButton?: boolean;
}

const AdminPackages: React.FC<AdminPackagesProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
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
        column={PackageTableColumns}
        columnsCount={5}
        showDummyData={false}
        pageSize={10}
      />

      {isAddPackageFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <AddPackageForm />
          </div>
        </div>
      )}

      {isEditPackageFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <EditPackageForm />
          </div>
        </div>
      )}

      {/* View Package Details Modal */}
      {isViewPackageDetailsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <PackageDetails />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPackages;