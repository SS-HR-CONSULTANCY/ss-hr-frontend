import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { closeEditPackageForm } from "@/store/slices/packageSlice";
import type { UpdatePackageFormData, CurrencyType, PackageCategoryType } from "@/types/entities/package";
import { getPackageById, updatePackage } from "@/utils/apis/adminPackageApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormLoading from "../../form/FormLoading";

const CATEGORY_LABELS: Record<PackageCategoryType, string> = {
  general: "General",
  visitvisa: "Visit Visa",
  visa: "Visa",
};

const EditPackageForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const { selectedPackageId } = useSelector((state: RootState) => state.package);

  const [formData, setFormData] = useState<UpdatePackageFormData>({
    packageName: "",
    price: "",
    currency: "AED",
    packageIncludes: "",
    packageCategory: "general",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { data: packageData, isLoading } = useQuery({
    queryKey: ["package", selectedPackageId],
    queryFn: () => getPackageById(selectedPackageId!),
    enabled: !!selectedPackageId,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdatePackageFormData) => updatePackage(selectedPackageId!, data),
    onSuccess: () => {
      toast.success("Package updated successfully");
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      dispatch(closeEditPackageForm());
    },
    onError: () => {
      toast.error("Failed to update package");
    },
  });

  useEffect(() => {
    if (packageData) {
      setFormData({
        packageName: packageData.packageName,
        price: packageData.price,
        currency: packageData.currency,
        packageIncludes: packageData.packageIncludes,
        packageCategory: packageData.packageCategory,
      });
    }
  }, [packageData]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (formData.packageName && formData.packageName.length < 2) {
      newErrors.packageName = "Package name must be at least 2 characters";
    }

    if (formData.packageIncludes && formData.packageIncludes.trim().length < 5) {
      newErrors.packageIncludes = "Package includes must be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      updateMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    dispatch(closeEditPackageForm());
  };

  if (isLoading) {
    return <FormLoading />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border mx-auto">
          <h2 className="text-xl font-semibold mb-6">Edit Package</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="packageName">Package Name</Label>
              <Input
                id="packageName"
                value={formData.packageName || ""}
                onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                placeholder="Enter package name"
              />
              {errors.packageName && (
                <p className="text-red-500 text-sm">{errors.packageName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={formData.price || ""}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 5000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency || "AED"}
                  onValueChange={(value: CurrencyType) =>
                    setFormData({ ...formData, currency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rs.">Rs.</SelectItem>
                    <SelectItem value="AED">AED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="packageCategory">Category</Label>
              <Select
                value={formData.packageCategory || "general"}
                onValueChange={(value: PackageCategoryType) =>
                  setFormData({ ...formData, packageCategory: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(CATEGORY_LABELS) as PackageCategoryType[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {CATEGORY_LABELS[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="packageIncludes">Package Includes</Label>
              <Textarea
                id="packageIncludes"
                value={formData.packageIncludes || ""}
                onChange={(e) => setFormData({ ...formData, packageIncludes: e.target.value })}
                placeholder="Describe what is included in this package..."
                rows={6}
              />
              {errors.packageIncludes && (
                <p className="text-red-500 text-sm">{errors.packageIncludes}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="outline" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Updating..." : "Update Package"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPackageForm;
