
export interface Package {
  _id: string;
  packageName: string;
  description: string;
  priceIN: string;
  priceUAE: string;
  packageType: 'jobpackage' | 'tourpackage';
  packageDuration: number;
  features: string[];
  food: boolean;
  accommodation: boolean;
  travelCard: boolean;
  utilityBills: boolean;
  airportPickup: boolean;
  jobGuidance: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePackageFormData {
  packageName: string;
  description: string;
  priceIN: string;
  priceUAE: string;
  packageType: 'jobpackage' | 'tourpackage';
  packageDuration: number;
  features: string[];
  food: boolean;
  accommodation: boolean;
  travelCard: boolean;
  utilityBills: boolean;
  airportPickup: boolean;
  jobGuidance: boolean;
}

export interface UpdatePackageFormData {
  packageName?: string;
  description?: string;
  priceIN?: string;
  priceUAE?: string;
  packageType?: 'jobpackage' | 'tourpackage';
  packageDuration?: number;
  features?: string[];
  food?: boolean;
  accommodation?: boolean;
  travelCard?: boolean;
  utilityBills?: boolean;
  airportPickup?: boolean;
  jobGuidance?: boolean;
}
