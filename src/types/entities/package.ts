export type CurrencyType = "Rs." | "AED";
export type PackageCategoryType = "general" | "visitvisa" | "visa";

export interface Package {
  _id: string;
  packageName: string;
  price: string;
  currency: CurrencyType;
  packageIncludes: string;
  packageCategory: PackageCategoryType;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePackageFormData {
  packageName: string;
  price: string;
  currency: CurrencyType;
  packageIncludes: string;
  packageCategory: PackageCategoryType;
}

export interface UpdatePackageFormData {
  packageName?: string;
  price?: string;
  currency?: CurrencyType;
  packageIncludes?: string;
  packageCategory?: PackageCategoryType;
}
