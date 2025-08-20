import type { LucideIcon } from "lucide-react";

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface Route {
  path: string;
  name: string;
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
  };
}

export interface statsMapIntrface<T> {
  title: string;
  key: keyof T;
  icon: LucideIcon;
  price?: boolean;
  plans?: string[];
}