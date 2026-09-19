import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  pageSize = 10,
  showDatePicker,
  saveDataInStore,
  showCategoryFilter,
  categoryOptions = [],
  showSearchInput,
  searchPlaceholder = "Search...",
  headerAction,
}: CommonTableComponentProps<T>) => {
  const dispatch = useDispatch<AppDispatch>();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [category, setCategory] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSize,
  });

  const handlePaginationChange: OnChangeFn<PaginationState> = (
    updaterOrValue,
  ) => {
    setPagination(updaterOrValue);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryFn: () =>
      fetchApiFunction({
        id,
        pagination: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          fromDate,
          toDate,
          category,
          searchQuery,
        },
      }),
    queryKey: [
      queryKey,
      pagination.pageIndex,
      pagination.pageSize,
      id,
      fromDate,
      toDate,
      category,
      searchQuery,
    ],
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const tableData = data?.data ?? [];

  const totalPages = data?.totalPages ?? 0;

  useEffect(() => {
    if (!saveDataInStore || !data) return;
    dispatch(
      saveReportData(data?.data as Array<AdminFetchReportTableDataResponse>),
    );
  }, [data, saveDataInStore, dispatch]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4 flex-wrap">
          {showDatePicker && (
            <div>
              <h2 className={`text-lg font-normal`}>
                Pick specific date range
              </h2>
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
          
          {showCategoryFilter && (
            <div className="mt-2">
              <h2 className={`text-lg font-normal mb-1`}>
                Filter by Category
              </h2>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {showSearchInput && (
            <div className="mt-2 relative flex items-center border-b border-gray-300 dark:border-gray-600 focus-within:border-[#00838f] transition-colors">
              <Search className="w-5 h-5 text-gray-400 absolute left-0" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-8 pr-2 py-2 h-10 w-64 bg-transparent border-none focus:outline-none focus:ring-0 text-foreground placeholder-gray-400"
              />
            </div>
          )}
        </div>
        
        {headerAction && (
          <div className="mt-2">
            {headerAction}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="mt-2">
          <TableShimmer columnsCount={columnsCount} />
        </div>
      ) : isError && error ? (
        <DataFetchingError
          message={(error as Error).message}
          className="min-h-full"
        />
      ) : (
        <DataTable
          columns={column}
          data={tableData}
          pageCount={totalPages}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      )}
    </div>
  );
};

export default CommonTable;
