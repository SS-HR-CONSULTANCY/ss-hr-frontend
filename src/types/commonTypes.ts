import type { LucideIcon } from "lucide-react";
import type { RoleType } from "@/utils/zod/commonZod";

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}

export interface Route {
  path: string;
  name: string;
  roles: RoleType[];
}

export interface ApiBaseResponse {
  success?: boolean;
  message?: string;
}

export interface ApiPaginatedResponse<T> extends ApiBaseResponse {
  data?: T[];
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}

export interface FetchFunctionParams<T = string> {
  id?: T;
  pagination?: {
    page: number;
    limit: number;
    fromDate?: string;
    toDate?: string;
    category?: string;
  };
}

export interface statsMapIntrface<T> {
  title: string;
  key: keyof T;
  icon: LucideIcon;
  price?: boolean;
  plans?: string[];
}

export type userDetail<T> = {
  label: string;
  key: keyof T;
  type: string;
};

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
}
