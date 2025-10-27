import { axiosInstance } from "@/lib/axios";
import type {
  ApiPaginatedResponse,
  FetchFunctionParams,
  ApiBaseResponse,
} from "@/types/commonTypes";
import {
  buildQueryParams,
  parseNewCommonResponse,
} from "@/utils/helpers/apiHelpers";
import type { Package } from "@/types/entities/package";

export interface PackageResponse {
  success: boolean;
  message: string;
  data: Package[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export interface SinglePackageResponse {
  success: boolean;
  message: string;
  package: Package;
}

export interface CreatePackageRequest {
  packageName: string;
  description: string;
  priceIN: string;
  priceUAE: string;
  packageType: "jobpackage" | "tourpackage";
  packageDuration: number;
  features: string[];
  food: boolean;
  accommodation: boolean;
  travelCard: boolean;
  utilityBills: boolean;
  airportPickup: boolean;
  jobGuidance: boolean;
}

export interface UpdatePackageRequest {
  packageName?: string;
  description?: string;
  priceIN?: string;
  priceUAE?: string;
  packageType?: "jobpackage" | "tourpackage";
  packageDuration?: number;
  features?: string[];
  food?: boolean;
  accommodation?: boolean;
  travelCard?: boolean;
  utilityBills?: boolean;
  airportPickup?: boolean;
  jobGuidance?: boolean;
}

export const getAllPackages = async (
  params?: FetchFunctionParams,
): Promise<ApiPaginatedResponse<Package>> => {
  const query = buildQueryParams(params);
  const response = await axiosInstance.get(
    `/admin/packages${query ? `?${query}` : ""}`,
  );
  return parseNewCommonResponse<Package>(response.data);
};

export const createPackage = async (
  packageData: CreatePackageRequest,
): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.post("/admin/packages", packageData);
  return response.data;
};

export const getPackageById = async (packageId: string): Promise<Package> => {
  const response = await axiosInstance.get(`/admin/packages/${packageId}`);
  return response.data.package;
};

export const updatePackage = async (
  packageId: string,
  packageData: UpdatePackageRequest,
): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.put(
    `/admin/packages/${packageId}`,
    packageData,
  );
  return response.data;
};

export const deletePackage = async (
  packageId: string,
): Promise<ApiBaseResponse> => {
  const response = await axiosInstance.delete(`/admin/packages/${packageId}`);
  return response.data;
};

export const getPackageStats = async (): Promise<
  ApiBaseResponse & { stats?: { totalPackages: number } }
> => {
  const response = await axiosInstance.get("/admin/packages/stats");
  return response.data;
};

export const getPackagesByType = async (
  packageType: string,
  params?: FetchFunctionParams,
): Promise<ApiPaginatedResponse<Package>> => {
  const query = buildQueryParams(params);
  const response = await axiosInstance.get(
    `/admin/packages/type/${packageType}${query ? `?${query}` : ""}`,
  );
  return parseNewCommonResponse<Package>(response.data);
};
