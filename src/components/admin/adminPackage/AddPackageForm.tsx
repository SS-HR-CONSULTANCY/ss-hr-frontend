import { toast } from "react-toastify";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { AppDispatch } from "@/store/store";
import { Textarea } from "@/components/ui/textarea";
import { createPackage } from "@/utils/apis/adminPackageApi";
import { toggleAddPackageForm } from "@/store/slices/packageSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreatePackageFormData, CurrencyType, PackageCategoryType } from "@/types/entities/package";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORY_LABELS: Record<PackageCategoryType, string> = {
  general: "General",
  visitvisa: "Visit Visa",
  visa: "Visa",
};

const AddPackageForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreatePackageFormData>({
    packageName: "",
    price: "",
    currency: "AED",
    packageIncludes: "",
    packageCategory: "general",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const createMutation = useMutation({
    mutationFn: createPackage,
    onSuccess: () => {
      toast.success("Package created successfully");
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      dispatch(toggleAddPackageForm());
      resetForm();
    },
    onError: () => {
      toast.error("Failed to create package");
    },
  });

  const resetForm = () => {
    setFormData({ packageName: "", price: "", currency: "AED", packageIncludes: "", packageCategory: "general" });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.packageName.trim()) {
      newErrors.packageName = "Package name is required";
    } else if (formData.packageName.length < 2) {
      newErrors.packageName = "Package name must be at least 2 characters";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    }

    if (!formData.packageIncludes.trim()) {
      newErrors.packageIncludes = "Package includes is required";
    } else if (formData.packageIncludes.trim().length < 5) {
      newErrors.packageIncludes = "Package includes must be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      createMutation.mutate(formData);
    }
  };

  const handleCancel = () => {
    dispatch(toggleAddPackageForm());
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 rounded-lg shadow-sm border mx-auto bg-white dark:bg-gray-700 text-black dark:text-white">
          <h2 className="text-xl font-semibold mb-6">Add New Package</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="packageName">Package Name</Label>
              <Input
                id="packageName"
                value={formData.packageName}
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
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g. 5000"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
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
                value={formData.packageCategory}
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
                value={formData.packageIncludes}
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
              <Button type="submit" variant="outline" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Package"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPackageForm;
