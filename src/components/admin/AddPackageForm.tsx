import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AppDispatch } from "@/store/store";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { createPackage } from "@/utils/apis/adminPackageApi";
import { toggleAddPackageForm } from "@/store/slices/packageSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreatePackageFormData } from "@/types/entities/package";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AddPackageForm: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<CreatePackageFormData>({
    packageName: "",
    description: "",
    priceIN: "",
    priceUAE: "",
    packageType: "jobpackage",
    packageDuration: 0,
    features: [""],
    food: false,
    accommodation: false,
    travelCard: false,
    utilityBills: false,
    airportPickup: false,
    jobGuidance: false,
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

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
    setFormData({
      packageName: "",
      description: "",
      priceIN: "",
      priceUAE: "",
      packageType: "jobpackage",
      packageDuration: 0,
      features: [""],
      food: false,
      accommodation: false,
      travelCard: false,
      utilityBills: false,
      airportPickup: false,
      jobGuidance: false,
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.packageName.trim()) {
      newErrors.packageName = "Package name is required";
    } else if (formData.packageName.length < 2) {
      newErrors.packageName = "Package name must be at least 2 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!formData.priceIN.trim()) {
      newErrors.priceIN = "Price in INR is required";
    }

    if (!formData.priceUAE.trim()) {
      newErrors.priceUAE = "Price in AED is required";
    }

    if (formData.packageDuration < 1 || formData.packageDuration > 365) {
      newErrors.packageDuration = "Duration must be between 1 and 365 days";
    }

    const validFeatures = formData.features.filter(f => f.trim());
    if (validFeatures.length === 0) {
      newErrors.features = "At least one feature is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const validFeatures = formData.features.filter(f => f.trim());
      createMutation.mutate({ ...formData, features: validFeatures });
    }
  };

  const handleCancel = () => {
    dispatch(toggleAddPackageForm());
    resetForm();
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const handlePriceINChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Remove existing ₹ symbol
    value = value.replace(/₹\s?/g, '');
    // Add ₹ symbol if value is not empty
    const formattedValue = value ? `₹ ${value}` : '';
    setFormData({ ...formData, priceIN: formattedValue });
  };

  const handlePriceUAEChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/AED\s?/g, '');
    const formattedValue = value ? `AED ${value}` : '';
    setFormData({ ...formData, priceUAE: formattedValue });
  };

  const handleServiceChange = (service: keyof Pick<CreatePackageFormData, 'food' | 'accommodation' | 'travelCard' | 'utilityBills' | 'airportPickup' | 'jobGuidance'>, checked: boolean) => {
    setFormData({ ...formData, [service]: checked });
  };

  return (
    <div className="p-6 rounded-lg shadow-sm border max-w-4xl mx-auto bg-white dark:bg-gray-700 text-black dark:text-white">
      <h2 className="text-xl font-semibold mb-6">Add New Package</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="packageName" className="">Package Name</Label>
            <Input
              id="packageName"
              value={formData.packageName}
              onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
              className=""
              placeholder="Enter package name"
            />
            {errors.packageName && <p className="text-red-500 text-sm mt-1">{errors.packageName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="packageType" className="">Package Type</Label>
            <Select
              value={formData.packageType}
              onValueChange={(value: 'jobpackage' | 'tourpackage') => 
                setFormData({ ...formData, packageType: value })
              }
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Select package type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jobpackage">Job Package</SelectItem>
                <SelectItem value="tourpackage">Tour Package</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className=""
            placeholder="Enter package description..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priceIN" className="">Price (INR)</Label>
            <Input
              id="priceIN"
              value={formData.priceIN}
              onChange={handlePriceINChange}
              className=""
              placeholder="₹ 2,50,000"
            />
            {errors.priceIN && <p className="text-red-500 text-sm mt-1">{errors.priceIN}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priceUAE" className="">Price (AED)</Label>
            <Input
              id="priceUAE"
              value={formData.priceUAE}
              onChange={handlePriceUAEChange}
              className=""
              placeholder="AED 8,500"
            />
            {errors.priceUAE && <p className="text-red-500 text-sm mt-1">{errors.priceUAE}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="packageDuration" className="">Duration (Days)</Label>
            <Input
              id="packageDuration"
              type="number"
              min="1"
              max="365"
              value={formData.packageDuration || ""}
              onChange={(e) => setFormData({ ...formData, packageDuration: parseInt(e.target.value) || 0 })}
              className=""
              placeholder="Enter duration in days"
            />
            {errors.packageDuration && <p className="text-red-500 text-sm mt-1">{errors.packageDuration}</p>}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <Label className="">Package Features</Label>
          <div className="space-y-2 mt-2">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  className=""
                  placeholder="Enter feature"
                />
                {formData.features.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeFeature(index)}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant={"outline"}
              onClick={addFeature}
            >
              Add Feature
            </Button>
            {errors.features && <p className="text-red-500 text-sm mt-1">{errors.features}</p>}
          </div>
        </div>

        {/* Services */}
        <div>
          <Label className="mb-3 block">Included Services</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'food', label: 'Food' },
              { key: 'accommodation', label: 'Accommodation' },
              { key: 'travelCard', label: 'Travel Card' },
              { key: 'utilityBills', label: 'Utility Bills' },
              { key: 'airportPickup', label: 'Airport Pickup' },
              { key: 'jobGuidance', label: 'Job Guidance' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={formData[key as keyof typeof formData] as boolean}
                  onCheckedChange={(checked) => 
                    handleServiceChange(key as 'food' | 'accommodation' | 'travelCard' | 'utilityBills' | 'airportPickup' | 'jobGuidance', checked as boolean)
                  }
                />
                <Label htmlFor={key} className="text-sm">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant={"outline"}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending}
            variant={"outline"}
          >
            {createMutation.isPending ? "Creating..." : "Create Package"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddPackageForm;