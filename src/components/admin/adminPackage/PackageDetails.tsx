import React from "react";
import FormLoading from "../../form/FormLoading";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { getPackageById } from "@/utils/apis/adminPackageApi";
import { closeViewPackageDetails } from "@/store/slices/packageSlice";
import type { PackageCategoryType } from "@/types/entities/package";

const CATEGORY_LABELS: Record<PackageCategoryType, string> = {
  general: "General",
  visitvisa: "Visit Visa",
  visa: "Visa",
};

const CATEGORY_COLORS: Record<PackageCategoryType, string> = {
  general: "bg-gray-100 text-gray-700",
  visitvisa: "bg-blue-100 text-blue-700",
  visa: "bg-green-100 text-green-700",
};

const PackageDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedPackageId } = useSelector((state: RootState) => state.package);

  const { data, isLoading } = useQuery({
    queryKey: ["package", selectedPackageId],
    queryFn: () => getPackageById(selectedPackageId!),
    enabled: !!selectedPackageId,
  });

  const handleClose = () => {
    dispatch(closeViewPackageDetails());
  };

  if (isLoading) return <FormLoading />;

  if (!data) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-red-500 text-lg font-medium">Package not found</p>
        <Button onClick={handleClose} className="mt-4" variant="outline">Close</Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 mx-auto bg-white dark:bg-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Package Details</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 border border-gray-200 dark:border-black rounded-lg">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold">{data.packageName}</h3>
                {data.packageCategory && (
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${CATEGORY_COLORS[data.packageCategory] ?? "bg-gray-100 text-gray-700"}`}>
                    {CATEGORY_LABELS[data.packageCategory] ?? data.packageCategory}
                  </span>
                )}
              </div>
            </div>

            <div className="p-4 border border-gray-200 dark:border-black rounded-lg">
              <h4 className="text-sm font-medium mb-1">Price</h4>
              <p className="text-lg font-semibold">{data.currency} {data.price}</p>
            </div>

            <div className="p-4 border border-gray-200 dark:border-black rounded-lg">
              <h4 className="text-sm font-medium mb-2">Package Includes</h4>
              <p className="whitespace-pre-wrap text-sm">{data.packageIncludes}</p>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t mt-6">
            <Button onClick={handleClose} variant="outline">Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
