import type { ColumnDef } from "@tanstack/react-table";
import type { ApiPaginatedResponse, FetchFunctionParams } from "../commonTypes";

export interface CommonTableComponentProps<T> {
  fetchApiFunction: (params?: FetchFunctionParams) => Promise<ApiPaginatedResponse<T>>;
  queryKey: string;
  heading?: string;
  headingClassName?: string;
  column: ColumnDef<T>[];
  columnsCount: number;
  id?: string;
  pageSize?: number;
}