import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import type { RootState, AppDispatch } from "@/store/store";
import { closeEditPackageForm } from "@/store/slices/packageSlice";
import { getPackageById, updatePackage } from "@/utils/apis/packageApi";
import type { UpdatePackageFormData } from "@/types/entities/package";

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
    image: "",
    features: [],
    food: false,
    accommodation: false,
    travelCard: false,
    utilityBills: false,
    airportPickup: false,
    jobGuidance: false,
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

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
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update package");
    },
  });

  useEffect(() => {
    if (packageData?.package) {
      setFormData({
        packageName: packageData.package.packageName,
        description: packageData.package.description,
        priceIN: packageData.package.priceIN,
        priceUAE: packageData.package.priceUAE,
        packageType: packageData.package.packageType,
        packageDuration: packageData.package.packageDuration,
        image: packageData.package.image,
        features: packageData.package.features,
        food: packageData.package.food,
        accommodation: packageData.package.accommodation,
        travelCard: packageData.package.travelCard,
        utilityBills: packageData.package.utilityBills,
        airportPickup: packageData.package.airportPickup,
        jobGuidance: packageData.package.jobGuidance,
      });
    }
  }, [packageData]);

  const isValidUrl = (string: string): boolean => {
    if (!string) return true;
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (formData.packageName && formData.packageName.length < 2) {
      newErrors.packageName = "Package name must be at least 2 characters";
    }

    if (formData.description && formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (formData.packageDuration && (formData.packageDuration < 1 || formData.packageDuration > 365)) {
      newErrors.packageDuration = "Duration must be between 1 and 365 days";
    }

    if (formData.image && !isValidUrl(formData.image)) {
      newErrors.image = "Please enter a valid image URL";
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
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-black mb-6">Edit Package</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="packageName" className="text-black">Package Name</Label>
            <Input
              id="packageName"
              value={formData.packageName || ""}
              onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
              className="bg-white text-black border-gray-300"
              placeholder="Enter package name"
            />
            {errors.packageName && <p className="text-red-500 text-sm mt-1">{errors.packageName}</p>}
          </div>

          <div>
            <Label htmlFor="packageType" className="text-black">Package Type</Label>
            <Select
              value={formData.packageType || "jobpackage"}
              onValueChange={(value: 'jobpackage' | 'tourpackage') => 
                setFormData({ ...formData, packageType: value })
              }
            >
              <SelectTrigger className="bg-white text-black border-gray-300">
                <SelectValue placeholder="Select package type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jobpackage">Job Package</SelectItem>
                <SelectItem value="tourpackage">Tour Package</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="text-black">Description</Label>
          <Textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-white text-black border-gray-300 min-h-24"
            placeholder="Enter package description..."
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Pricing & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="priceIN" className="text-black">Price (INR)</Label>
            <Input
              id="priceIN"
              value={formData.priceIN || ""}
              onChange={handlePriceINChange}
              className="bg-white text-black border-gray-300"
              placeholder="₹ 2,50,000"
            />
            {errors.priceIN && <p className="text-red-500 text-sm mt-1">{errors.priceIN}</p>}
          </div>

          <div>
            <Label htmlFor="priceUAE" className="text-black">Price (AED)</Label>
            <Input
              id="priceUAE"
              value={formData.priceUAE || ""}
              onChange={handlePriceUAEChange}
              className="bg-white text-black border-gray-300"
              placeholder="AED 8,500"
            />
            {errors.priceUAE && <p className="text-red-500 text-sm mt-1">{errors.priceUAE}</p>}
          </div>

          <div>
            <Label htmlFor="packageDuration" className="text-black">Duration (Days)</Label>
            <Input
              id="packageDuration"
              type="number"
              min="1"
              max="365"
              value={formData.packageDuration?.toString() || ""}
              onChange={(e) => setFormData({ ...formData, packageDuration: parseInt(e.target.value) || undefined })}
              className="bg-white text-black border-gray-300"
              placeholder="Enter duration in days"
            />
            {errors.packageDuration && <p className="text-red-500 text-sm mt-1">{errors.packageDuration}</p>}
          </div>
        </div>

        {/* Image */}
        <div>
          <Label htmlFor="image" className="text-black">Package Image URL</Label>
          <Input
            id="image"
            value={formData.image || ""}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="bg-white text-black border-gray-300"
            placeholder="https://example.com/package-image.jpg"
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
        </div>

        {/* Features */}
        <div>
          <Label className="text-black">Package Features</Label>
          <div className="space-y-2 mt-2">
            {(formData.features || []).map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  className="bg-white text-black border-gray-300"
                  placeholder="Enter feature"
                />
                {(formData.features?.length || 0) > 1 && (
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
              variant="outline"
              onClick={addFeature}
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              Add Feature
            </Button>
            {errors.features && <p className="text-red-500 text-sm mt-1">{errors.features}</p>}
          </div>
        </div>

        {/* Services */}
        <div>
          <Label className="text-black mb-3 block">Included Services</Label>
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
                    handleServiceChange(key as any, checked as boolean)
                  }
                />
                <Label htmlFor={key} className="text-black text-sm">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="border-gray-300 text-black hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {updateMutation.isPending ? "Updating..." : "Update Package"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPackageForm;