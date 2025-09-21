import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { closeEditPackageForm } from "@/store/slices/packageSlice";
import type { UpdatePackageFormData } from "@/types/entities/package";
import { getPackageById, updatePackage } from "@/utils/apis/adminPackageApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormLoading from "../form/FormLoading";

const EditPackageForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const { selectedPackageId } = useSelector((state: RootState) => state.package);

  const [formData, setFormData] = useState<UpdatePackageFormData>({
    packageName: "",
    description: "",
    priceIN: "",
    priceUAE: "",
    packageType: "jobpackage",
    packageDuration: undefined,
    features: [],
    food: false,
    accommodation: false,
    travelCard: false,
    utilityBills: false,
    airportPickup: false,
    jobGuidance: false,
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
        description: packageData.description,
        priceIN: packageData.priceIN,
        priceUAE: packageData.priceUAE,
        packageType: packageData.packageType,
        packageDuration: packageData.packageDuration,
        features: packageData.features,
        food: packageData.food,
        accommodation: packageData.accommodation,
        travelCard: packageData.travelCard,
        utilityBills: packageData.utilityBills,
        airportPickup: packageData.airportPickup,
        jobGuidance: packageData.jobGuidance,
      });
    }
  }, [packageData]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (formData.packageName && formData.packageName.length < 2) {
      newErrors.packageName = "Package name must be at least 2 characters";
    }

    if (formData.description && formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (formData.packageDuration && (formData.packageDuration < 1 || formData.packageDuration > 365)) {
      newErrors.packageDuration = "Duration must be between 1 and 365 days";
    }

    if (formData.features && formData.features.length > 0) {
      const validFeatures = formData.features.filter(f => f.trim());
      if (validFeatures.length === 0) {
        newErrors.features = "At least one feature is required if features are provided";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const validFeatures = formData.features?.filter(f => f.trim()) || [];
      updateMutation.mutate({ ...formData, features: validFeatures });
    }
  };

  const handleCancel = () => {
    dispatch(closeEditPackageForm());
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...(formData.features || []), ""] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features?.filter((_, i) => i !== index) || [];
    setFormData({ ...formData, features: newFeatures });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
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
    // Remove existing AED symbol
    value = value.replace(/AED\s?/g, '');
    // Add AED symbol if value is not empty
    const formattedValue = value ? `AED ${value}` : '';
    setFormData({ ...formData, priceUAE: formattedValue });
  };

  const handleServiceChange = (service: keyof Pick<UpdatePackageFormData, 'food' | 'accommodation' | 'travelCard' | 'utilityBills' | 'airportPickup' | 'jobGuidance'>, checked: boolean) => {
    setFormData({ ...formData, [service]: checked });
  };

  if (isLoading) {
    return (
      <FormLoading />
    );
  }

  return (
    <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Edit Package</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="packageName" className="">Package Name</Label>
            <Input
              id="packageName"
              value={formData.packageName || ""}
              onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
              className=""
              placeholder="Enter package name"
            />
            {errors.packageName && <p className="text-red-500 text-sm mt-1">{errors.packageName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="packageType" className="">Package Type</Label>
            <Select
              value={formData.packageType || "jobpackage"}
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
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className=""
            placeholder="Enter package description..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Pricing & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priceIN" className="">Price (INR)</Label>
            <Input
              id="priceIN"
              value={formData.priceIN || ""}
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
              value={formData.priceUAE || ""}
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
              value={formData.packageDuration?.toString() || ""}
              onChange={(e) => setFormData({ ...formData, packageDuration: parseInt(e.target.value) || undefined })}
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
            {(formData.features || []).map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  className=""
                  placeholder="Enter feature"
                />
                {(formData.features?.length || 0) > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeFeature(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
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
                  checked={(formData[key as keyof typeof formData] as boolean) || false}
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
            variant={"outline"}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Updating..." : "Update Package"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPackageForm;