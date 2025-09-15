import React from "react";
import FormLoading from "../form/FormLoading";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { getPackageById } from "@/utils/apis/adminPackageApi";
import { closeViewPackageDetails } from "@/store/slices/packageSlice";

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

  if (isLoading) {
    return (
      <FormLoading />
    );
  }

  if (!data) {
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

  const getPackageTypeLabel = (type: string) => {
    return type === 'jobpackage' ? 'Job Package' : 'Tour Package';
  };

  const getPackageTypeBadge = (type: string) => {
    return type === 'jobpackage' 
      ? "bg-blue-100 text-blue-800" 
      : "bg-green-100 text-green-800";
  };

  const services = [
    { key: 'food', label: 'Food', value: data.food },
    { key: 'accommodation', label: 'Accommodation', value: data.accommodation },
    { key: 'travelCard', label: 'Travel Card', value: data.travelCard },
    { key: 'utilityBills', label: 'Utility Bills', value: data.utilityBills },
    { key: 'airportPickup', label: 'Airport Pickup', value: data.airportPickup },
    { key: 'jobGuidance', label: 'Job Guidance', value: data.jobGuidance },
  ];

  const includedServices = services.filter(service => service.value);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Package Details</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPackageTypeBadge(data.packageType)}`}>
          {getPackageTypeLabel(data.packageType)}
        </span>
      </div>

      <div className="space-y-6">
        {/* Package Header */}
        <div className="p-4 border border-gray-200 dark:border-black rounded-lg">
          <div className="flex items-start gap-4">
            <img
              src={data.image}
              alt={data.packageName}
              className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200 dark:border-black"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/150x150?text=Package+Image';
              }}
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">{data.packageName}</h3>
              <p className="leading-relaxed">{data.description}</p>
            </div>
          </div>
        </div>

        {/* Pricing & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 dark:border-black rounded-lg">
            <h4 className="text-sm font-medium  mb-1">Price (INR)</h4>
            <p className="text-lg font-semibold ">{data.priceIN}</p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-black rounded-lg">
            <h4 className="text-sm font-medium  mb-1">Price (AED)</h4>
            <p className="text-lg font-semibold ">{data.priceUAE}</p>
          </div>
          <div className="p-4 border border-gray-200 dark:border-black rounded-lg">
            <h4 className="text-sm font-medium  mb-1">Duration</h4>
            <p className="text-lg font-semibold ">{data.packageDuration} days</p>
          </div>
        </div>

        {/* Package Features */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Package Features</h3>
          <div className="p-4 border border-gray-200 dark:border-black rounded-lg">
            {data.features.length > 0 ? (
              <ul className="space-y-2">
                {data.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    <span className="">{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className=" italic">No features listed</p>
            )}
          </div>
        </div>

        {/* Included Services */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Included Services</h3>
          <div className="p-4 border border-gray-200 dark:border-black rounded-lg">
            {includedServices.length > 0 ? (
              <ul className="space-y-2">
                {includedServices.map(({ key, label }) => (
                  <li key={key} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="">{label}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className=" italic">No services included</p>
            )}
          </div>
        </div>
      </div>

      {/* Close Button */}
      <div className="flex justify-end pt-6 border-t">
        <Button
          onClick={handleClose}
          variant="outline"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default PackageDetails;