import dayjs from "dayjs";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import noProfile from '../../../assets/defaultImgaes/noProfile.png';
import type { AdminfetchAllApplicationsResponse, AdminfetchAllComapniesResponse, AdminfetchAllJobsResponse, AdminfetchAllPackagesResponse, AdminfetchAllPaymentsResponse, AdminfetchAllReviewsResponse, AdminfetchAllUsersResponse, AdminFetchReportTableDataResponse } from "@/types/apiTypes/admin";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


export const AdminUsersTableColumns: ColumnDef<AdminfetchAllUsersResponse>[] = [
  {
    accessorKey: "profileImage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Profile" />
    ),
    cell: ({ row }) => {
      const img = row.original.profileImage || noProfile;
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
    accessorKey: "isBlocked",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Account Status" />),
    cell: ({ row }) => {
      const isBlocked = row.original.isBlocked;
      return <span>{isBlocked ? "Blocked" : "Active"}</span>;
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

export const AdminJobsTableColumns: ColumnDef<AdminfetchAllJobsResponse>[] = [
  {
    accessorKey: "companyName",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Company Name" />)
  },
  {
    accessorKey: "designation",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Designation" />)
  },
  {
    accessorKey: "vacancy",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Vacancy" />)
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

export const AdminPackagesTableColumns: ColumnDef<AdminfetchAllPackagesResponse>[] = [
  {
    accessorKey: "packageName",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Package" />)
  },
  {
    accessorKey: "description",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="description" />)
  },
  {
    accessorKey: "price",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Price" />)
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

export const AdminPaymentsTableColumns: ColumnDef<AdminfetchAllPaymentsResponse>[] = [
  {
    accessorKey: "transactionId",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Transaction Id" />)
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Total Amount" />)
  },
  {
    accessorKey: "discountAmount",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Discounted Amount" />)
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="Status" />)
  },
  {
    accessorKey: "username",
    header: ({ column }) => (<DataTableColumnHeader column={column} title="User" />)
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Paid On" />
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