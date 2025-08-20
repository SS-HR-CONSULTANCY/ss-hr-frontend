import type { ColumnDef } from "@tanstack/react-table";
import type { ApiPaginatedResponse, FetchFunctionParams } from "../commonTypes";

export interface CommonTableComponentProps<T> {
  fetchApiFunction: (params?: FetchFunctionParams) => Promise<ApiPaginatedResponse<T>>;
  queryKey: string;
  heading?: string;
  description?: string;
  headingClassName?: string;
  column: ColumnDef<T>[];
  columnsCount: number;
  id?: string;
  pageSize?: number;
  dummyData?: T[];
  showDummyData?: boolean;
  showDatePicker?: boolean;
  saveDataInStore?: boolean;
}