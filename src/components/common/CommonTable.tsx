import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { Search, Filter, X, UserCheck } from "lucide-react";
import { ENQUIRY_STATUS_CONFIG } from "@/utils/enquiryStatusConfig";
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
  showStatusFilter,
  statusOptions,
  showAssignedStaffFilter,
  staffOptions = [],
  headerAction,
  onDataFetched,
}: CommonTableComponentProps<T>) => {
  const dispatch = useDispatch<AppDispatch>();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [category, setCategory] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assignedStaffFilter, setAssignedStaffFilter] = useState("all");

  const hasActiveFilter =
    (showAssignedStaffFilter && assignedStaffFilter !== "all") ||
    (showStatusFilter && statusFilter !== "all");

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
          status: statusFilter === "all" ? undefined : statusFilter,
          assignedTo: assignedStaffFilter === "all" ? undefined : assignedStaffFilter,
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
      statusFilter,
      assignedStaffFilter,
    ],
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const tableData = data?.data ?? [];

  const totalPages = data?.totalPages ?? 0;

  useEffect(() => {
    if (data && onDataFetched) {
      onDataFetched(data as any);
    }
    if (!saveDataInStore || !data) return;
    dispatch(
      saveReportData(data?.data as Array<AdminFetchReportTableDataResponse>),
    );
  }, [data, saveDataInStore, dispatch, onDataFetched]);

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
            <div className="mt-2 relative flex items-center border-b border-gray-300 dark:border-gray-600 focus-within:border-[#00838f] transition-colors">
              <Filter className="w-4 h-4 text-gray-400 absolute left-0 pointer-events-none" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="pl-6 pr-2 py-2 h-10 w-44 bg-transparent border-none focus:outline-none focus:ring-0 text-foreground text-sm appearance-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
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
                className="pl-8 pr-7 py-2 h-10 w-64 bg-transparent border-none focus:outline-none focus:ring-0 text-foreground placeholder-gray-400"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {showAssignedStaffFilter && (
            <div className="mt-2 relative flex items-center border-b border-gray-300 dark:border-gray-600 focus-within:border-[#00838f] transition-colors">
              <UserCheck className="w-4 h-4 text-gray-400 absolute left-0 pointer-events-none" />
              <select
                value={assignedStaffFilter}
                onChange={(e) => {
                  setAssignedStaffFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className="pl-6 pr-6 py-2 h-10 w-48 bg-transparent border-none focus:outline-none focus:ring-0 text-foreground text-sm cursor-pointer"
              >
                <option value="all" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                  All Assigned Staff
                </option>
                <option value="unassigned" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                  Unassigned
                </option>
                {staffOptions?.map((staff) => (
                  <option
                    key={staff._id}
                    value={staff._id}
                    className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  >
                    {staff.fullName || staff.username || staff.name || "Staff"}
                  </option>
                ))}
              </select>
              {assignedStaffFilter !== "all" && (
                <button
                  type="button"
                  onClick={() => {
                    setAssignedStaffFilter("all");
                    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
                  aria-label="Clear staff filter"
                  title="Clear staff filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {showStatusFilter && (
            <div className="mt-2 relative flex items-center border-b border-gray-300 dark:border-gray-600 focus-within:border-[#00838f] transition-colors">
              <Filter className="w-4 h-4 text-gray-400 absolute left-0 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
                className="pl-6 pr-6 py-2 h-10 w-44 bg-transparent border-none focus:outline-none focus:ring-0 text-foreground text-sm cursor-pointer"
              >
                <option value="all" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                  All Statuses
                </option>
                {(statusOptions
                  ? statusOptions.map((o) => [o.value, { label: o.label }] as [string, { label: string }])
                  : (Object.entries(ENQUIRY_STATUS_CONFIG) as [string, { label: string }][])
                ).map(
                  ([key, cfg]) => (
                    <option key={key} value={key} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                      {cfg.label}
                    </option>
                  )
                )}
              </select>
              {statusFilter !== "all" && (
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("all");
                    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
                  aria-label="Clear status filter"
                  title="Clear status filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {hasActiveFilter && (
            <div className="mt-2 flex items-center">
              {isLoading ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-400 animate-pulse border border-gray-200 dark:border-gray-700">
                  Loading...
                </span>
              ) : typeof data?.totalCount === "number" ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-50 dark:bg-cyan-950/60 text-[#00838f] dark:text-cyan-300 border border-cyan-200/80 dark:border-cyan-800/80 shadow-sm animate-in fade-in duration-150">
                  <span className="font-bold">{data.totalCount}</span>
                  <span className="text-[11px] font-normal text-cyan-700/80 dark:text-cyan-400/80">
                    {data.totalCount === 1 ? "contact" : "contacts"}
                  </span>
                </span>
              ) : null}
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
