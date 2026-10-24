import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type PaginationState,
  type OnChangeFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "../ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterAccessorKeys?: string[];
  pageCount?: number;
  onPaginationChange?: OnChangeFn<PaginationState>;
  pagination?: PaginationState;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  onPaginationChange,
  pagination: controlledPagination,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const paginationState = controlledPagination || internalPagination;

  const handlePaginationChange: OnChangeFn<PaginationState> = React.useCallback(
    (updaterOrValue) => {
      if (onPaginationChange) {
        onPaginationChange(updaterOrValue);
      } else {
        setInternalPagination(updaterOrValue);
      }
    },
    [onPaginationChange],
  );

  const table = useReactTable({
    data,
    columns,
    getRowId: (row: any) => row._id || row.id,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: handlePaginationChange,
    manualPagination: !!pageCount,
    pageCount: pageCount ?? -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination: paginationState,
    },
  });

  return (
    <div>


      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-transparent"
                >
                  {headerGroup.headers.map((header) => {
                    const isNameColumn =
                      header.column.id === "name" ||
                      header.column.id === "fullName" ||
                      header.column.id === "clientName" ||
                      header.column.id === "customerName";
                    return (
                      <TableHead
                        key={header.id}
                        className={`py-2 px-1 font-semibold text-gray-700 dark:text-gray-300 text-[11px] ${
                          isNameColumn ? "text-left pl-2" : "text-center"
                        }`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isNameColumn =
                        cell.column.id === "name" ||
                        cell.column.id === "fullName" ||
                        cell.column.id === "clientName" ||
                        cell.column.id === "customerName";
                      return (
                        <TableCell
                          key={cell.id}
                          className={`py-2 px-1 text-gray-700 dark:text-gray-300 ${
                            isNameColumn ? "text-left pl-2" : "text-center"
                          }`}
                        >
                          <div
                            className={`flex items-center w-full ${
                              isNameColumn ? "justify-start text-left" : "justify-center"
                            }`}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-gray-500 font-medium"
                  >
                    No Data Found In Database.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Centered Pagination Section */}
        <div className="flex items-center justify-center py-3 px-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/40 dark:bg-gray-900/40">
          {/* Main Controls Row - Perfectly Centered */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {/* Jump Previous 10 Pages */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs font-medium border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-40 transition-colors"
              onClick={() => {
                const newPage = Math.max(0, paginationState.pageIndex - 10);
                table.setPageIndex(newPage);
              }}
              disabled={!table.getCanPreviousPage()}
              title="Previous 10 pages"
              aria-label="Previous 10 pages"
            >
              <ChevronsLeft className="h-3.5 w-3.5 mr-0.5" />
              <span>-10</span>
            </Button>

            {/* Previous 1 Page */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs font-medium border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-40 transition-colors"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              title="Previous page"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-1" />
              <span>Previous</span>
            </Button>

            {/* Numbered Page Buttons */}
            <div className="flex items-center gap-1 hidden sm:flex">
              {(() => {
                const total = pageCount && pageCount > 0 ? pageCount : Math.max(1, table.getPageCount());
                const current = paginationState.pageIndex + 1;
                const pages: number[] = [];

                let startPage = Math.max(1, current - 4);
                let endPage = startPage + 9;

                if (endPage > total) {
                  endPage = total;
                  startPage = Math.max(1, endPage - 9);
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(i);
                }

                return pages.map((p) => {
                  const isActive = p === current;
                  return (
                    <Button
                      key={p}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => table.setPageIndex(p - 1)}
                      className={
                        isActive
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 p-0 text-xs font-semibold shadow-xs"
                          : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 h-8 w-8 p-0 text-xs font-medium"
                      }
                    >
                      {p}
                    </Button>
                  );
                });
              })()}
            </div>

            {/* Next 1 Page */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs font-medium border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-40 transition-colors"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              title="Next page"
              aria-label="Next page"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>

            {/* Jump Next 10 Pages */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs font-medium border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-40 transition-colors"
              onClick={() => {
                const total = pageCount && pageCount > 0 ? pageCount : Math.max(1, table.getPageCount());
                const maxPageIndex = Math.max(0, total - 1);
                const newPage = Math.min(maxPageIndex, paginationState.pageIndex + 10);
                table.setPageIndex(newPage);
              }}
              disabled={!table.getCanNextPage()}
              title="Next 10 pages"
              aria-label="Next 10 pages"
            >
              <span>+10</span>
              <ChevronsRight className="h-3.5 w-3.5 ml-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
