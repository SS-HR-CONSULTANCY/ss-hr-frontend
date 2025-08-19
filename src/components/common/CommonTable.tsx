import { useState } from "react";
import { DataTable } from "../table/data-table";
import { useQuery } from "@tanstack/react-query";
import TableShimmer from "../shimmer/TableShimmer";
import DataFetchingError from "./DataFetchingError";
import { type OnChangeFn, type PaginationState } from "@tanstack/react-table";
import type { CommonTableComponentProps } from "@/types/componentTypes/commonTableTypes";


const CommonTable = <T,>({
  fetchApiFunction,
  queryKey,
  heading,
  description,
  headingClassName,
  column,
  columnsCount,
  id,
  dummyData,
  showDummyData,
  pageSize = 5,
}: CommonTableComponentProps<T>) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  })

  const handlePaginationChange: OnChangeFn<PaginationState> = (updaterOrValue) => {
    setPagination(updaterOrValue);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => fetchApiFunction({ 
      id, 
      pagination: { 
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize 
      } 
    }),
    queryKey: [queryKey, pagination.pageIndex, pagination.pageSize, id],
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !showDummyData,
  });

  const tableData =
  showDummyData && dummyData && dummyData.length > 0
    ? dummyData.slice(
        pagination.pageIndex * pagination.pageSize,
        (pagination.pageIndex + 1) * pagination.pageSize
      )
    : data?.data ?? [];

const totalPages =
  showDummyData && dummyData
    ? Math.ceil(dummyData.length / pagination.pageSize)
    : data?.totalPages ?? 0;

  return (
    <div className="p-4">
      {heading && (
        <h2 className={`text-2xl lg:text-3xl font-bold ${headingClassName}`}>{heading}</h2>
      )}
      {description && (
        <h2 className={`text-sm font-normatl`}>{description}</h2>
      )}

      {isLoading && !showDummyData ? (
        <div className="mt-2">
          <TableShimmer columnsCount={columnsCount} />
        </div>
      ) : tableData.length > 0 ? (
        <DataTable
          columns={column}
          data={tableData}
          pageCount={totalPages}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      ) : isError && error ? (
        <DataFetchingError
          message={(error as Error).message}
          className="min-h-full"
        />
      ) : (
        <DataFetchingError
          message={`No ${queryKey} found in database`}
          className="min-h-full"
        />
      )}
    </div>
  );
};

export default CommonTable;