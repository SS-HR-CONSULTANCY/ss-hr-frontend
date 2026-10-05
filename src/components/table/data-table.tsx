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
                    return (
                      <TableHead key={header.id} className="text-center py-3 font-semibold text-gray-700 dark:text-gray-300">
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
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center py-3 text-gray-700 dark:text-gray-300">
                        <div className="flex justify-center items-center w-full">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </div>
                      </TableCell>
                    ))}
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

        {/* Use built-in pagination controls */}
        <div className="flex justify-center items-center py-3 px-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 relative">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-800 h-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>

            <div className="flex items-center space-x-1 hidden sm:flex">
              {(() => {
                const total = pageCount || table.getPageCount();
                const current = paginationState.pageIndex + 1;
                const pages: (number | string)[] = [];

                let startPage = Math.max(1, current - 4);
                let endPage = startPage + 9;

                if (endPage > total) {
                  endPage = total;
                  startPage = Math.max(1, endPage - 9);
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(i);
                }

                return pages.map((p, idx) => (
                  <Button
                    key={idx}
                    variant={p === current ? "default" : "outline"}
                    size="sm"
                    onClick={() => typeof p === "number" && table.setPageIndex(p - 1)}
                    disabled={typeof p !== "number"}
                    className={
                      typeof p !== "number" 
                        ? "border-transparent px-1 cursor-default hover:bg-transparent h-8 w-8" 
                        : p === current
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8"
                          : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 h-8 w-8"
                    }
                  >
                    {p}
                  </Button>
                ));
              })()}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-800 h-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
