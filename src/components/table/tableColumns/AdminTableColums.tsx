import dayjs from "dayjs";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { AdminfetchAllApplicationsResponse, AdminfetchAllReviewsResponse, AdminFetchReportTableDataResponse } from "@/types/apiTypes/adminApiTypes";

export const AdminReviewsTableColumns: ColumnDef<AdminfetchAllReviewsResponse>[] = [
  {
    accessorKey: "text",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Review Content" />)
  },
  {
    accessorKey: "username",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="User" />)
  },
  {
    accessorKey: "job",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Designation" />)
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Added On" />
    ),
    cell: ({ row }) => {
      const date = dayjs(row.original.createdAt).format("DD MMM YYYY");
      return <span>{date}</span>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: () => {
      //   const provider = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropDownItemGetProviderDetailPage providerId={provider._id} />
            {!provider.isAdminVerified && (
              <DropDownItemApproveProvider providerId={provider._id} />
            )} */}
            {/* <DropDownItemChangeProviderBlockStatus providerId={provider._id} isBlocked={provider.isBlocked} /> */}
            {/* <DropDownItemChangeProviderTrustTag providerId={provider._id} trustedBySlotflow={provider.trustedBySlotflow} /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  },
]

export const AdminApplicationsTableColumns: ColumnDef<AdminfetchAllApplicationsResponse>[] = [
  {
    accessorKey: "username",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="User" />)
  },
  {
    accessorKey: "company",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Company Name" />)
  },
  {
    accessorKey: "designation",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Designation" />)
  },
  {
    accessorKey: "cvLink",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="CV url" />)
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applient On" />
    ),
    cell: ({ row }) => {
      const date = dayjs(row.original.createdAt).format("DD MMM YYYY");
      return <span>{date}</span>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: () => {
      //   const provider = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropDownItemGetProviderDetailPage providerId={provider._id} />
            {!provider.isAdminVerified && (
              <DropDownItemApproveProvider providerId={provider._id} />
            )} */}
            {/* <DropDownItemChangeProviderBlockStatus providerId={provider._id} isBlocked={provider.isBlocked} /> */}
            {/* <DropDownItemChangeProviderTrustTag providerId={provider._id} trustedBySlotflow={provider.trustedBySlotflow} /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  },
]

export const AdminReportDataTableColumns: ColumnDef<AdminFetchReportTableDataResponse>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Applient On" />
    ),
    cell: ({ row }) => {
      const date = dayjs(row.original.date).format("DD MMM YYYY");
      return <span>{date}</span>;
    },
  },
  {
    accessorKey: "jobApplications",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Applications" />)
  },
  {
    accessorKey: "packagesTaken",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Packages" />)
  },
  {
    accessorKey: "revenueFromJobApplications",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Revenue From Application" />)
  },
  {
    accessorKey: "revenueFromPackages",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Revenue From Package" />)
  },
  {
    accessorKey: "totalRevenue",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Total Revenue" />)
  },
]