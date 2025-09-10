import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { DataTable } from "../table/data-table";
import { useQuery } from "@tanstack/react-query";
import type { AppDispatch } from "@/store/store";
import TableShimmer from "../shimmer/TableShimmer";
import DataFetchingError from "./DataFetchingError";
import { saveReportData } from "@/store/slices/adminSlice";
import { type OnChangeFn, type PaginationState } from "@tanstack/react-table";
import type { AdminFetchReportTableDataResponse } from "@/types/apiTypes/adminApiTypes";
import type { CommonTableComponentProps } from "@/types/componentTypes/commonTableTypes";

const CommonTable = <T,>({
  fetchApiFunction,
  queryKey,
  column,
  columnsCount,
  id,
  dummyData,
  showDummyData,
  pageSize = 5,
  showDatePicker,
  saveDataInStore,
}: CommonTableComponentProps<T>) => {

  const dispatch = useDispatch<AppDispatch>();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

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
        limit: pagination.pageSize,
        fromDate,
        toDate
      }
    }),
    queryKey: [queryKey, pagination.pageIndex, pagination.pageSize, id, fromDate, toDate],
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

  useEffect(() => {
    if (!saveDataInStore || !data) return;
    dispatch(saveReportData(data?.data as Array<AdminFetchReportTableDataResponse>));
  }, [data, saveDataInStore, dispatch]);

  console.log("tableData : ",tableData)

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4 space-y-2">
          {showDatePicker && (
            <div>
              <h2 className={`text-lg font-normal`}>Pick specific date range</h2>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border rounded p-2"
              />
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border rounded p-2"
              />
            </div>
          )}
        </div>
      </div>

      {isLoading && !showDummyData ? (
        <div className="mt-2">
          <TableShimmer columnsCount={columnsCount} />
        </div>
      ) : tableData.length > 0 ?  (
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