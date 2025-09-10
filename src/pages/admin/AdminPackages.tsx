import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import type { AppDispatch, RootState } from "@/store/store";
import { getAllPackages } from "@/utils/apis/packageApi";
import {toggleAddPackageForm} from "@/store/slices/packageSlice";
import type { AdminfetchAllPackagesResponse } from "@/types/apiTypes/admin";
import CommonTable from "@/components/common/CommonTable";
import { PackageTableColumns } from "@/components/table/tableColumns/PackageTableColumns";
import AddPackageForm from "@/components/admin/AddPackageForm";
import EditPackageForm from "@/components/admin/EditPackageForm";
import PackageDetails from "@/components/admin/PackageDetails";

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
    <div className="min-h-screen bg-gray-900">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center p-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Packages
          </h1>
          <p className="text-sm font-normal text-gray-400">
            Job and tour packages for HR consultancy services
          </p>
        </div>
        <Button
          onClick={() => dispatch(toggleAddPackageForm())}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Add Package
        </Button>
      </div>

      {/* Packages Table */}
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

      {/* Add Package Modal */}
      {isAddPackageFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <AddPackageForm />
          </div>
        </div>
      )}

      {/* Edit Package Modal */}
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
    </div>
  );
};

export default AdminPackages;