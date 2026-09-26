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
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { adminFetchAllAccounts } from "@/utils/apis/adminAccountApi";
import { adminFetchAllCategories, adminCreateCategory } from "@/utils/apis/adminCategoryApi";
import { ENQUIRY_STATUS_CONFIG, getStatusConfig } from "@/utils/enquiryStatusConfig";
import { Input } from "@/components/ui/input";

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

export const CategorySelectCell = ({ enquiry, handleUpdateCategory }: { enquiry: any; handleUpdateCategory: (id: string, category: string | null) => void }) => {
  const [category, setCategory] = useState<string>((enquiry as any).category || "none");
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    setCategory((enquiry as any).category || "none");
  }, [(enquiry as any).category]);

  const { data: categoriesData } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: adminFetchAllCategories,
  });
  const categories = categoriesData?.data ?? [];

  const createCategoryMutation = useMutation({
    mutationFn: (name: string) => adminCreateCategory(name),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
        setCategory(data.data.name);
        handleUpdateCategory(enquiry._id, data.data.name);
        setIsAddingCategory(false);
        setNewCategoryName("");
      }
    }
  });

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    createCategoryMutation.mutate(newCategoryName.trim());
  };

  if (isAddingCategory) {
    return (
      <div className="flex items-center gap-1 w-[180px]">
        <Input 
          value={newCategoryName} 
          onChange={e => setNewCategoryName(e.target.value)}
          placeholder="New category..."
          className="h-8 text-xs px-2"
        />
        <Button type="button" size="sm" onClick={handleAddCategory} disabled={createCategoryMutation.isPending} className="h-8 px-2">Save</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setIsAddingCategory(false)} className="h-8 px-2">X</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Select
        value={category}
        onValueChange={(value) => {
          setCategory(value);
          handleUpdateCategory(enquiry._id, value === "none" ? null : value);
        }}
      >
        <SelectTrigger className="w-[130px] h-8 text-xs">
          <SelectValue placeholder="Assign..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none"><span className="text-slate-400">— None —</span></SelectItem>
          {categories.map((c: any) => (
            <SelectItem key={c._id} value={c.name}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="button" size="icon" variant="outline" onClick={() => setIsAddingCategory(true)} title="Add new category" className="h-8 w-8">
        +
      </Button>
    </div>
  );
};

export const CommentCell = ({ enquiry, handleUpdateComment }: { enquiry: any; handleUpdateComment: (id: string, comment: string | null) => void }) => {
  const [comment, setComment] = useState(enquiry.comment || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    handleUpdateComment(enquiry._id, comment);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 min-w-[150px]">
        <Input 
          value={comment} 
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add comment..."
          className="h-8 text-xs px-2"
          autoFocus
        />
        <Button type="button" size="sm" onClick={handleSave} className="h-8 px-2">Save</Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setIsEditing(false)} className="h-8 px-2">X</Button>
      </div>
    );
  }

  return (
    <div 
      className="cursor-pointer min-w-[150px] text-xs p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center min-h-[32px] text-slate-700 dark:text-slate-200 font-medium"
      onClick={() => setIsEditing(true)}
      title="Click to edit comment"
    >
      {comment ? comment : <span className="text-slate-400 italic">No comment...</span>}
    </div>
  );
};

export const AdminEnquiryTableColumns = (
  handleViewEnquiry: (enquiryId: string) => void,
  handleDeleteEnquiry: (enquiryId: string) => void,
  handleUpdateStatus: (enquiryId: string, status: "pending" | "contacted" | "need_follow_up" | "not_interested" | "processing_application" | "completed" | "rejected_application") => void,
  handleUpdateAccount: (enquiryId: string, account: string | null) => void,
  handleUpdateCategory: (enquiryId: string, category: string | null) => void,
  handleUpdateComment: (enquiryId: string, comment: string | null) => void,
  columnsType: "default" | "follow-up" = "default"
): ColumnDef<AdminFetchAllEnquiriesResponse>[] => {
  const allColumns: ColumnDef<AdminFetchAllEnquiriesResponse>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        return <span className="text-slate-700 dark:text-slate-200 font-medium text-xs whitespace-nowrap">{format(new Date(row.original.createdAt), "dd MMM yyyy")}</span>;
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        const { firstName, lastName } = row.original;
        const fullName = `${firstName || ""} ${lastName || ""}`.trim();
        return <span className="text-slate-700 dark:text-slate-200 font-medium text-xs whitespace-nowrap">{toTitleCase(fullName)}</span>;
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
            className="text-slate-700 dark:text-slate-200 font-medium hover:underline flex items-center gap-1.5 whitespace-nowrap"
            title="Message on WhatsApp"
          >
            <IconBrandWhatsapp size={16} className="text-green-600 shrink-0" />
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
          <span title={subject} className="text-slate-700 dark:text-slate-200 font-medium text-xs whitespace-nowrap">
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
          <div className="flex flex-col items-center gap-1 py-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewEnquiry(enquiry._id)}
              className="h-5 w-5 p-0 text-blue-500 cursor-pointer hover:bg-blue-500/20 hover:text-blue-500"
              title="View Details"
            >
              <Eye className="h-2.5 w-2.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteEnquiry(enquiry._id)}
              className="h-5 w-5 p-0 text-red-500 cursor-pointer hover:bg-red-500/20 hover:text-red-500"
              title="Delete Enquiry"
            >
              <Trash2 className="h-2.5 w-2.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  return allColumns;
};
