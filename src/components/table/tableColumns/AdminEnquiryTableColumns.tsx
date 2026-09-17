import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Trash2 } from "lucide-react";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { AdminFetchAllEnquiriesResponse, AccountResponse } from "@/types/apiTypes/adminApiTypes";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { adminFetchAllAccounts } from "@/utils/apis/adminAccountApi";

const formatWhatsAppNumber = (phone: string) => {
  if (!phone) return "";
  let clean = phone.trim().replace(/[^0-9+]/g, '');
  if (clean.startsWith('+')) return clean;
  if (clean.startsWith('0') && clean.length === 11) return '+91' + clean.substring(1);
  if (clean.length === 10) return '+91' + clean;
  if (clean.length > 0) return '+' + clean;
  return clean;
};

const validStatuses = ["pending", "contacted", "need_follow_up", "processing_application", "completed"];

const StatusSelectCell = ({ enquiry, handleUpdateStatus }: any) => {
  const initialStatus = validStatuses.includes(enquiry.status?.toLowerCase()) 
    ? enquiry.status.toLowerCase() 
    : "pending";
    
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    const newStatus = validStatuses.includes(enquiry.status?.toLowerCase()) 
      ? enquiry.status.toLowerCase() 
      : "pending";
    setStatus(newStatus);
  }, [enquiry.status]);

  return (
    <Select
      value={status}
      onValueChange={(value) => {
        setStatus(value);
        handleUpdateStatus(enquiry._id, value as any);
      }}
    >
      <SelectTrigger className="w-[160px] h-8 text-xs">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="contacted">Contacted</SelectItem>
        <SelectItem value="need_follow_up">Need Follow Up</SelectItem>
        <SelectItem value="processing_application">Processing Application</SelectItem>
        <SelectItem value="completed">Completed</SelectItem>
      </SelectContent>
    </Select>
  );
};

const AccountSelectCell = ({ enquiry, handleUpdateAccount }: { enquiry: AdminFetchAllEnquiriesResponse; handleUpdateAccount: (id: string, account: string | null) => void }) => {
  const [account, setAccount] = useState<string>(enquiry.account || "none");

  useEffect(() => {
    setAccount(enquiry.account || "none");
  }, [enquiry.account]);

  const { data: accountsData } = useQuery({
    queryKey: ["adminAccounts"],
    queryFn: adminFetchAllAccounts,
  });
  const accounts: AccountResponse[] = accountsData?.data ?? [];

  return (
    <Select
      value={account}
      onValueChange={(value) => {
        setAccount(value);
        handleUpdateAccount(enquiry._id, value === "none" ? null : value);
      }}
    >
      <SelectTrigger className="w-[130px] h-8 text-xs">
        <SelectValue placeholder="Assign..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none"><span className="text-slate-400">— None —</span></SelectItem>
        {accounts.map((a) => (
          <SelectItem key={a._id} value={a.name}>{a.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const AdminEnquiryTableColumns = (
  handleViewEnquiry: (enquiryId: string) => void,
  handleDeleteEnquiry: (enquiryId: string) => void,
  handleUpdateStatus: (enquiryId: string, status: "pending" | "contacted" | "need_follow_up" | "processing_application" | "completed") => void,
  handleUpdateAccount: (enquiryId: string, account: string | null) => void
): ColumnDef<AdminFetchAllEnquiriesResponse>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return format(new Date(row.original.createdAt), "dd MMM yyyy");
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const { firstName, lastName } = row.original;
      return `${firstName} ${lastName}`;
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone / WhatsApp" />
    ),
    cell: ({ row }) => {
      const originalPhone = row.original.phone;
      if (!originalPhone) return <span className="text-gray-400 text-sm">N/A</span>;
      
      const formattedPhone = formatWhatsAppNumber(originalPhone);
      const waNumber = formattedPhone.replace('+', '');
      const message = encodeURIComponent("Hi, we are SS HR Consultancy. How can I help you?");
      const waLink = `https://wa.me/${waNumber}?text=${message}`;

      const handleClick = () => {
        handleUpdateStatus(row.original._id, "contacted");
      };

      return (
        <a 
          href={waLink} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={handleClick}
          className="text-green-600 hover:text-green-700 visited:text-[#4682B4] dark:text-green-400 dark:hover:text-green-300 dark:visited:text-[#5c98ca] font-medium hover:underline flex items-center gap-1.5"
          title="Message on WhatsApp"
        >
          <IconBrandWhatsapp size={16} />
          {formattedPhone}
        </a>
      );
    },
  },
  {
    accessorKey: "subject",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subject" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return (
        <StatusSelectCell 
          enquiry={row.original} 
          handleUpdateStatus={handleUpdateStatus} 
        />
      );
    },
  },
  {
    accessorKey: "account",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account" />
    ),
    cell: ({ row }) => (
      <AccountSelectCell
        enquiry={row.original}
        handleUpdateAccount={handleUpdateAccount}
      />
    ),
  },

  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const enquiry = row.original;
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewEnquiry(enquiry._id)}
            className="h-8 w-8 p-0 text-blue-500 cursor-pointer hover:bg-blue-500/20 hover:text-blue-500"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteEnquiry(enquiry._id)}
            className="h-8 w-8 p-0 text-red-500 cursor-pointer hover:bg-red-500/20 hover:text-red-500"
            title="Delete Enquiry"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
