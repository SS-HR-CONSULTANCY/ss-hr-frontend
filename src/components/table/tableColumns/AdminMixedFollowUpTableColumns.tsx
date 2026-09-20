import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Eye, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { StatusTimelinePopover } from "@/components/admin/adminEnquiry/StatusTimelinePopover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { format } from "date-fns";
import { ENQUIRY_STATUS_CONFIG, getStatusConfig } from "@/utils/enquiryStatusConfig";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetchAllCategories, adminCreateCategory } from "@/utils/apis/adminCategoryApi";

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

export const CategorySelectCell = ({ enquiry, handleUpdateCategory }: any) => {
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
        handleUpdateCategory(enquiry, data.data.name);
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
          handleUpdateCategory(enquiry, value === "none" ? null : value);
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

const StatusSelectCell = ({ enquiry, handleUpdateStatus }: any) => {
  const initialStatus = validStatuses.includes(enquiry.status?.toLowerCase()) 
    ? enquiry.status.toLowerCase() 
    : "need_follow_up";
    
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    const newStatus = validStatuses.includes(enquiry.status?.toLowerCase()) 
      ? enquiry.status.toLowerCase() 
      : "need_follow_up";
    setStatus(newStatus);
  }, [enquiry.status]);

  const cfg = getStatusConfig(status);

  return (
    <Select
      value={status}
      onValueChange={(value) => {
        setStatus(value);
        handleUpdateStatus(enquiry, value as any);
      }}
    >
      <SelectTrigger className={`w-[185px] h-8 text-xs font-semibold border ${cfg.triggerClass}`}>
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(ENQUIRY_STATUS_CONFIG)
          .filter(([value]) => !['pending', 'contacted'].includes(value))
          .map(([value, c]) => (
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

export const CommentCell = ({ enquiry, handleUpdateComment }: any) => {
  const [comment, setComment] = useState(enquiry.comment || "");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setComment(enquiry.comment || "");
  }, [enquiry.comment, enquiry._id]);

  const handleSave = () => {
    handleUpdateComment(enquiry, comment);
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
      className="cursor-pointer min-w-[150px] text-xs p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center min-h-[32px]"
      onClick={() => setIsEditing(true)}
      title="Click to edit comment"
    >
      {comment ? comment : <span className="text-slate-400 italic">No comment...</span>}
    </div>
  );
};

export const ReminderCell = ({ enquiry, handleUpdateReminder }: any) => {
  const [date, setDate] = useState<Date | undefined>(
    enquiry.reminder ? new Date(enquiry.reminder) : undefined
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setDate(enquiry.reminder ? new Date(enquiry.reminder) : undefined);
  }, [enquiry.reminder, enquiry._id]);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    handleUpdateReminder(enquiry, selectedDate ? selectedDate.toISOString() : null);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[130px] justify-start text-left font-normal h-8 text-xs px-2",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-3.5 w-3.5" />
          {date ? format(date, "dd-MM-yy") : <span>Set reminder</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export const AdminMixedFollowUpTableColumns = (
  handleViewWebEnquiry: (enquiryId: string) => void,
  handleEditWhatsappEnquiry: (enquiry: any) => void,
  handleDeleteEnquiry: (enquiry: any) => void,
  handleUpdateStatus: (enquiry: any, status: any) => void,
  handleUpdateCategory: (enquiry: any, category: string | null) => void,
  handleUpdateComment: (enquiry: any, comment: string | null) => void,
  handleUpdateReminder: (enquiry: any, reminder: string | null) => void
): ColumnDef<any>[] => {
  return [
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
        const name = row.original.enquiryType === 'Website' 
          ? `${row.original.firstName || ""} ${row.original.lastName || ""}`.trim()
          : row.original.name;
        return toTitleCase(name || "");
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone / WhatsApp" />
      ),
      cell: ({ row }) => {
        const originalPhone = row.original.enquiryType === 'Website' ? row.original.phone : row.original.contactNumber;
        if (!originalPhone) return <span className="text-gray-400 text-sm">N/A</span>;
        
        const formattedPhone = formatWhatsAppNumber(originalPhone);
        const waNumber = formattedPhone.replace('+', '');
        const message = encodeURIComponent("Hi, we are SS HR Consultancy. How can I help you?");
        const waLink = `https://wa.me/${waNumber}?text=${message}`;

        const handleClick = () => {
          handleUpdateStatus(row.original, "contacted");
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
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => {
        const category = row.original.category;
        return (
          <span className={category ? "font-medium" : "text-slate-400 italic"}>
            {category || "— None —"}
          </span>
        );
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
      accessorKey: "comment",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Comment" />
      ),
      cell: ({ row }) => (
        <CommentCell
          enquiry={row.original}
          handleUpdateComment={handleUpdateComment}
        />
      ),
    },
    {
      accessorKey: "reminder",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Reminder" />
      ),
      cell: ({ row }) => (
        <ReminderCell
          enquiry={row.original}
          handleUpdateReminder={handleUpdateReminder}
        />
      ),
    },
    {
      accessorKey: "timeline",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Timeline" />
      ),
      cell: ({ row }) => (
        <StatusTimelinePopover statusHistory={row.original.statusHistory} />
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
            {enquiry.enquiryType === 'Website' ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewWebEnquiry(enquiry._id)}
                className="h-5 w-5 p-0 text-blue-500 cursor-pointer hover:bg-blue-500/20 hover:text-blue-500"
                title="View Details"
              >
                <Eye className="h-2.5 w-2.5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEditWhatsappEnquiry(enquiry)}
                className="h-5 w-5 p-0 text-blue-500 cursor-pointer hover:bg-blue-500/20 hover:text-blue-500"
                title="Edit Enquiry"
              >
                <Pencil className="h-2.5 w-2.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteEnquiry(enquiry)}
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
};
