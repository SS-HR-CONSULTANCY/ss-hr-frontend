import type { LucideIcon } from "lucide-react";
import type { Role } from "./entities/user";

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}

export interface Route {
  path: string;
  name: string;
  roles: Role[];
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


export type ProfileDetail<T> = {
    label: string;
    key: keyof T;
    type: string;
};