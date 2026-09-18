import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import type { AdminFetchAllWhatsappEnquiriesResponse, AccountResponse } from "@/types/apiTypes/adminApiTypes";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { adminFetchAllAccounts } from "@/utils/apis/adminAccountApi";
import { ENQUIRY_STATUS_CONFIG, getStatusConfig } from "@/utils/enquiryStatusConfig";
import { CategorySelectCell } from "./AdminEnquiryTableColumns";

const toTitleCase = (str: string) => {
  if (!str) return "";
  return str.split(" ").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(" ");
};

const formatWhatsAppNumber = (phone: string) => {
  if (!phone) return "";
  let clean = phone.trim().replace(/[^0-9+]/g, '');
  if (clean.startsWith('+')) return clean;
  if (clean.startsWith('0') && clean.length === 11) return '+91' + clean.substring(1);
  if (clean.length === 10) return '+91' + clean;
  if (clean.length > 0) return '+' + clean;
  return clean;
};

const validStatuses = ["pending", "contacted", "need_follow_up", "not_interested", "processing_application", "completed", "rejected_application"];

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

  const cfg = getStatusConfig(status);

  return (
    <Select
      value={status}
      onValueChange={(value) => {
        setStatus(value);
        handleUpdateStatus(enquiry._id, value as any);
      }}
    >
      <SelectTrigger className={`w-[185px] h-8 text-xs font-semibold border ${cfg.triggerClass}`}>
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(ENQUIRY_STATUS_CONFIG).map(([value, c]) => (
          <SelectItem key={value} value={value}>
            <span className="flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${c.dotClass}`} />
              {c.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const AccountSelectCell = ({ enquiry, handleUpdateAccount }: { enquiry: AdminFetchAllWhatsappEnquiriesResponse; handleUpdateAccount: (id: string, account: string | null) => void }) => {
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

export const AdminWhatsappEnquiryTableColumns = (
  handleEditEnquiry: (enquiry: AdminFetchAllWhatsappEnquiriesResponse) => void,
  handleDeleteEnquiry: (enquiryId: string) => void,
  handleUpdateStatus: (enquiryId: string, status: "pending" | "contacted" | "need_follow_up" | "not_interested" | "processing_application" | "completed" | "rejected_application") => void,
  handleUpdateAccount: (enquiryId: string, account: string | null) => void,
  handleUpdateCategory: (enquiryId: string, category: string | null) => void
): ColumnDef<AdminFetchAllWhatsappEnquiriesResponse>[] => [
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      return format(new Date(row.original.date), "dd MMM yyyy");
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return toTitleCase(row.original.name || "");
    }
  },
  {
    accessorKey: "contactNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="WhatsApp Number" />
    ),
    cell: ({ row }) => {
      const originalPhone = row.original.contactNumber;
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
    cell: ({ row }) => {
      const subject = row.original.subject || "";
      return (
        <span title={subject}>
          {subject.length > 20 ? subject.substring(0, 20) + "....." : subject}
        </span>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      return <CategorySelectCell enquiry={row.original} handleUpdateCategory={handleUpdateCategory} />;
    },
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
            onClick={() => handleEditEnquiry(enquiry)}
            className="h-8 w-8 p-0 text-blue-500 cursor-pointer hover:bg-blue-500/20 hover:text-blue-500"
            title="Edit Enquiry"
          >
            <Pencil className="h-4 w-4" />
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
