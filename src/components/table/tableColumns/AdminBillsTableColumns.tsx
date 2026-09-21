import React, { useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { format } from "date-fns";
import type { AdminFetchAllBillsResponse } from "@/types/apiTypes/adminApiTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const toTitleCase = (str: string) => {
  if (!str) return "";
  return str.split(" ").map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(" ");
};

const InlineAmountCell = ({ value, currency, onSave }: { value: number, currency: string, onSave: (val: number, cur: string) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(value?.toString() || "0");
  const [cur, setCur] = useState(currency || "AED");

  useEffect(() => { 
    setVal(value?.toString() || "0"); 
    setCur(currency || "AED");
  }, [value, currency]);

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 min-w-[200px]">
        <Select value={cur} onValueChange={setCur}>
          <SelectTrigger className="w-[70px] h-8 text-xs px-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AED">AED</SelectItem>
            <SelectItem value="INR">INR</SelectItem>
          </SelectContent>
        </Select>
        <Input 
          type="number"
          value={val} 
          onChange={e => setVal(e.target.value)}
          className="h-8 text-xs px-2 w-[80px]"
          autoFocus
        />
        <Button size="sm" className="h-8 px-2" onClick={() => { onSave(Number(val), cur); setIsEditing(false); }}>✓</Button>
        <Button size="sm" variant="outline" className="h-8 px-2" onClick={() => setIsEditing(false)}>✕</Button>
      </div>
    );
  }

  return (
    <div 
      className="cursor-pointer min-w-[100px] p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded font-medium"
      onClick={() => setIsEditing(true)}
    >
      {value > 0 ? `${currency} ${value}` : <span className="text-slate-400 italic text-xs">Enter amount</span>}
    </div>
  );
};

const InlineCommentCell = ({ value, onSave }: { value: string, onSave: (val: string) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(value || "");

  useEffect(() => { setVal(value || ""); }, [value]);

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 min-w-[150px]">
        <Input 
          value={val} 
          onChange={e => setVal(e.target.value)}
          className="h-8 text-xs px-2"
          placeholder="Add comment..."
          autoFocus
        />
        <Button size="sm" className="h-8 px-2" onClick={() => { onSave(val); setIsEditing(false); }}>✓</Button>
        <Button size="sm" variant="outline" className="h-8 px-2" onClick={() => setIsEditing(false)}>✕</Button>
      </div>
    );
  }

  return (
    <div 
      className="cursor-pointer min-w-[120px] text-xs p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center min-h-[32px]"
      onClick={() => setIsEditing(true)}
    >
      {value ? value : <span className="text-slate-400 italic">No comment...</span>}
    </div>
  );
};

const PaymentHistoryPopover = ({ 
  history, 
  currency,
  onAddPayment 
}: { 
  history: Array<{ _id?: string, date: string, amount: number }>, 
  currency: string,
  onAddPayment: (date: string, amount: number) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCalOpen, setIsCalOpen] = useState(false);

  const handleAdd = () => {
    if (amount && date) {
      onAddPayment(date.toISOString(), Number(amount));
      setAmount("");
      setDate(new Date());
    }
  };

  const totalPaid = history.reduce((sum, p) => sum + p.amount, 0);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn("h-8 text-xs font-medium", totalPaid > 0 && "text-blue-600 dark:text-blue-400")}>
          {totalPaid > 0 ? `${currency} ${totalPaid} +` : "Add Payment +"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-semibold text-sm">Payment History</h4>
          
          <div className="max-h-[150px] overflow-y-auto space-y-2">
            {history.length === 0 ? (
              <p className="text-xs text-slate-500">No payments recorded.</p>
            ) : (
              history.map((p, idx) => (
                <div key={p._id || idx} className="flex justify-between items-center text-xs border-b pb-1">
                  <span>{format(new Date(p.date), "dd MMM yyyy")}</span>
                  <span className="font-medium text-green-600">{currency} {p.amount}</span>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t flex flex-col gap-2">
            <span className="text-xs font-semibold">New Payment</span>
            
            <Popover open={isCalOpen} onOpenChange={setIsCalOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-8 text-xs px-2",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                  {date ? format(date, "dd-MM-yy") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => { setDate(d); setIsCalOpen(false); }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <div className="flex items-center gap-2">
              <Input 
                type="number" 
                placeholder={`Amount (${currency})`} 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className="h-8 text-xs"
              />
              <Button size="sm" onClick={handleAdd} className="h-8 px-3 text-xs" title="Save Payment" disabled={!amount || !date}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const AdminBillsTableColumns = (
  handleUpdateInvoiceAmount: (enquiry: AdminFetchAllBillsResponse, amount: number, currency: string) => void,
  handleUpdateStatus: (enquiry: AdminFetchAllBillsResponse, status: string) => void,
  handleUpdateComment: (enquiry: AdminFetchAllBillsResponse, comment: string) => void,
  handleAddPayment: (enquiry: AdminFetchAllBillsResponse, payment: { date: string, amount: number }) => void
): ColumnDef<AdminFetchAllBillsResponse>[] => {
  return [
    {
      accessorKey: "date",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      cell: ({ row }) => <span className="text-xs">{format(new Date(row.original.date), "dd MMM yyyy")}</span>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => <span className="font-medium text-xs">{toTitleCase(row.original.name)}</span>,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
      cell: ({ row }) => <span className="text-xs">{row.original.phone || "N/A"}</span>,
    },
    {
      accessorKey: "invoiceNumber",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Invoice No" />,
      cell: ({ row }) => (
        <span className="font-semibold text-xs text-blue-600 dark:text-blue-400">
          {row.original.invoiceNumber || <span className="text-slate-400 font-normal">Pending</span>}
        </span>
      ),
    },
    {
      accessorKey: "invoiceAmount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Invoice Amt" />,
      cell: ({ row }) => (
        <InlineAmountCell 
          value={row.original.invoiceAmount} 
          currency={row.original.currency}
          onSave={(val, cur) => handleUpdateInvoiceAmount(row.original, val, cur)} 
        />
      ),
    },
    {
      accessorKey: "paymentHistory",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Payments" />,
      cell: ({ row }) => (
        <PaymentHistoryPopover 
          history={row.original.paymentHistory || []} 
          currency={row.original.currency}
          onAddPayment={(date, amount) => handleAddPayment(row.original, { date, amount })} 
        />
      ),
    },
    {
      accessorKey: "balanceAmount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Balance" />,
      cell: ({ row }) => {
        const bal = row.original.balanceAmount || 0;
        const cur = row.original.currency || "AED";
        return <span className={cn("font-medium text-xs", bal > 0 ? "text-red-500" : "text-green-500")}>{cur} {bal}</span>;
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => (
        <Select
          value={row.original.status || "pending"}
          onValueChange={(value) => handleUpdateStatus(row.original, value)}
        >
          <SelectTrigger className="w-[120px] h-8 text-xs font-semibold">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending"><span className="text-orange-500">Pending</span></SelectItem>
            <SelectItem value="partially_paid"><span className="text-blue-500">Partially Paid</span></SelectItem>
            <SelectItem value="paid"><span className="text-green-500">Paid</span></SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      accessorKey: "comment",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Comment" />,
      cell: ({ row }) => (
        <InlineCommentCell 
          value={row.original.comment} 
          onSave={(val) => handleUpdateComment(row.original, val)} 
        />
      ),
    },
  ];
};
