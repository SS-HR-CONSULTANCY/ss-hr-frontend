import dayjs from "dayjs";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import noProfile from '../../../assets/defaultImgaes/noProfile.png';
import type { AdminfetchAllComapniesResponse, AdminfetchAllJobsResponse, AdminfetchAllUsersResponse } from "@/types/apiTypes/admin";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


export const AdminUsersTableColumns: ColumnDef<AdminfetchAllUsersResponse>[] = [
  {
    accessorKey: "profileImg",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Profile" />
    ),
    cell: ({ row }) => {
      const img = row.original.profileImg || noProfile;
      return (
        <img
          src={img}
          alt={row.original.fullName}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    },
  },
  {
    accessorKey: "fullName",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Fullname" />)
  },
  {
    accessorKey: "email",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Email" />)
  },
  {
    accessorKey: "isActive",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Account Status" />),
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return <span>{isActive ? "Active" : "Inactive"}</span>;
    },
  },
  {
    accessorKey: "isVerified",
    header: "Admin Verication",
    cell: ({ row }) => {
      const isVerified = row.original.isVerified;
      return <span>{isVerified ? "verified" : "Pending"}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined On" />
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


export const AdminCompaniesTableColumns: ColumnDef<AdminfetchAllComapniesResponse>[] = [
  {
    accessorKey: "companyLogo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Logo" />
    ),
    cell: ({ row }) => {
      const img = row.original.companyLogo || noProfile;
      return (
        <img
          src={img}
          alt={row.original.companyName}
          className="w-10 h-10 rounded-full object-cover"
        />
      );
    },
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Company Name" />)
  },
  {
    accessorKey: "email",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Email" />)
  },
  {
    accessorKey: "availableJobCount",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Availability" />)
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined On" />
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

export const AdminJobsTableColumns: ColumnDef<AdminfetchAllJobsResponse>[] = [
  {
    accessorKey: "companyName",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Name" />)
  },
  {
    accessorKey: "companyName",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Company Name" />)
  },
  {
    accessorKey: "jobPost",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Job Post" />)
  },
  {
    accessorKey: "availableCount",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Availability" />)
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined On" />
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