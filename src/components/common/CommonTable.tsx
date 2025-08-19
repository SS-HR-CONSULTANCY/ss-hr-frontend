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
  headingClassName,
  column,
  columnsCount,
  id,
  pageSize = 10,
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
  });

  return (
    <div className="p-2">
      {heading && (
        <h2 className={`text-2xl font-bold ${headingClassName}`}>{heading}</h2>
      )}
      {isLoading ? (
        <div className="mt-2">
          <TableShimmer columnsCount={columnsCount} />
        </div>
      ) : data?.data ? (
        <DataTable
          columns={column} 
          data={data.data}
          pageCount={data.totalPages}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      ) : isError && error ? (
        <DataFetchingError message={(error as Error).message} className="min-h-full" />
      ) : (
        <DataFetchingError message={"No "+queryKey+" found in databse"} className="min-h-full" />
      )}
    </div>
  );
};

export default CommonTable;