import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { RootState, AppDispatch } from "@/store/store";
import { closeViewPackageDetails } from "@/store/slices/packageSlice";
import { getPackageById } from "@/utils/apis/packageApi";

const PackageDetails: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedPackageId } = useSelector((state: RootState) => state.package);

  const { data: packageData, isLoading } = useQuery({
    queryKey: ["package", selectedPackageId],
    queryFn: () => getPackageById(selectedPackageId!),
    enabled: !!selectedPackageId,
  });

  const handleClose = () => {
    dispatch(closeViewPackageDetails());
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!packageData?.package) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium">Package not found</p>
          <p className="text-gray-600 mt-2">The requested package could not be loaded.</p>
          <Button onClick={handleClose} className="mt-4" variant="outline">
            Close
          </Button>
        </div>
      </div>
    );
  }

  const { package: packageDetails } = packageData;

  const getPackageTypeLabel = (type: string) => {
    return type === 'jobpackage' ? 'Job Package' : 'Tour Package';
  };

  const getPackageTypeBadge = (type: string) => {
    return type === 'jobpackage' 
      ? "bg-blue-100 text-blue-800" 
      : "bg-green-100 text-green-800";
  };

  const services = [
    { key: 'food', label: 'Food', value: packageDetails.food },
    { key: 'accommodation', label: 'Accommodation', value: packageDetails.accommodation },
    { key: 'travelCard', label: 'Travel Card', value: packageDetails.travelCard },
    { key: 'utilityBills', label: 'Utility Bills', value: packageDetails.utilityBills },
    { key: 'airportPickup', label: 'Airport Pickup', value: packageDetails.airportPickup },
    { key: 'jobGuidance', label: 'Job Guidance', value: packageDetails.jobGuidance },
  ];

  const includedServices = services.filter(service => service.value);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black">Package Details</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPackageTypeBadge(packageDetails.packageType)}`}>
          {getPackageTypeLabel(packageDetails.packageType)}
        </span>
      </div>

      <div className="space-y-6">
        {/* Package Header */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-start gap-4">
            <img
              src={packageDetails.image}
              alt={packageDetails.packageName}
              className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/150x150?text=Package+Image';
              }}
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-black mb-2">{packageDetails.packageName}</h3>
              <p className="text-gray-600 leading-relaxed">{packageDetails.description}</p>
            </div>
          </div>
        </div>

        {/* Pricing & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Price (INR)</h4>
            <p className="text-lg font-semibold text-black">{packageDetails.priceIN}</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Price (AED)</h4>
            <p className="text-lg font-semibold text-black">{packageDetails.priceUAE}</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Duration</h4>
            <p className="text-lg font-semibold text-black">{packageDetails.packageDuration} days</p>
          </div>
        </div>

        {/* Package Features */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-3">Package Features</h3>
          <div className="p-4 border border-gray-200 rounded-lg">
            {packageDetails.features.length > 0 ? (
              <ul className="space-y-2">
                {packageDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span className="text-black">{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No features listed</p>
            )}
          </div>
        </div>

        {/* Included Services */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-3">Included Services</h3>
          <div className="p-4 border border-gray-200 rounded-lg">
            {includedServices.length > 0 ? (
              <ul className="space-y-2">
                {includedServices.map(({ key, label }) => (
                  <li key={key} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-black">{label}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No services included</p>
            )}
          </div>
        </div>
      </div>

      {/* Close Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button
          onClick={handleClose}
          variant="outline"
          className="border-gray-300 text-black hover:bg-gray-50"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default PackageDetails;