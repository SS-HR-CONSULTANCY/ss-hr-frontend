import { useState, useEffect } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
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
import { CalendarIcon, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExpenseItem } from "@/utils/apis/adminExpenseApi";

const InlineTextCell = ({
  value,
  placeholder,
  onSave,
}: {
  value: string;
  placeholder: string;
  onSave: (val: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(value || "");

  useEffect(() => {
    setVal(value || "");
  }, [value]);

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 min-w-[75px]">
        <Input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="h-6 text-[11px] px-1"
          placeholder={placeholder}
          autoFocus
        />
        <Button
          size="sm"
          className="h-6 px-1 text-[10px]"
          onClick={() => {
            onSave(val);
            setIsEditing(false);
          }}
        >
          ✓
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-6 px-1 text-[10px]"
          onClick={() => setIsEditing(false)}
        >
          ✕
        </Button>
      </div>
    );
  }

  return (
    <div
      className="cursor-pointer text-[11px] px-1 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center min-h-[24px] truncate text-slate-700 dark:text-slate-200 font-medium"
      onClick={() => setIsEditing(true)}
    >
      {value ? (
        <span className="truncate">{value}</span>
      ) : (
        <span className="text-slate-400 italic text-[10px] truncate">{placeholder}</span>
      )}
    </div>
  );
};

const InlineAmountCell = ({
  value,
  currency,
  onSave,
}: {
  value: number;
  currency: string;
  onSave: (val: number, cur: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(value?.toString() || "0");
  const [cur, setCur] = useState(currency || "AED");

  useEffect(() => {
    setVal(value?.toString() || "0");
    setCur(currency || "AED");
  }, [value, currency]);

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 min-w-[100px]">
        <Select value={cur} onValueChange={setCur}>
          <SelectTrigger className="w-[48px] h-6 text-[10px] px-1">
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
          onChange={(e) => setVal(e.target.value)}
          className="h-6 text-[11px] px-1 w-[45px]"
          autoFocus
        />
        <Button
          size="sm"
          className="h-6 px-1 text-[10px]"
          onClick={() => {
            onSave(Number(val), cur);
            setIsEditing(false);
          }}
        >
          ✓
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-6 px-1 text-[10px]"
          onClick={() => setIsEditing(false)}
        >
          ✕
        </Button>
      </div>
    );
  }

  return (
    <div
      className="cursor-pointer px-1 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded font-medium text-[11px] whitespace-nowrap text-slate-700 dark:text-slate-200"
      onClick={() => setIsEditing(true)}
    >
      {value > 0 ? (
        `${currency} ${value}`
      ) : (
        <span className="text-slate-400 italic text-[10px]">Enter amount</span>
      )}
    </div>
  );
};

const InlineDueDateCell = ({
  value,
  isFullyPaid,
  onSave,
}: {
  value?: string;
  isFullyPaid: boolean;
  onSave: (val: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  useEffect(() => {
    setDate(value ? new Date(value) : undefined);
  }, [value]);

  const handleSelect = (d: Date | undefined) => {
    setDate(d);
    setIsOpen(false);
    if (d) {
      onSave(d.toISOString());
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={isFullyPaid}
          className={cn(
            "w-[82px] justify-start text-left font-normal h-6 text-[10px] px-1 whitespace-nowrap",
            !date && "text-muted-foreground border-dashed",
            isFullyPaid && "opacity-40"
          )}
        >
          <CalendarIcon className="mr-1 h-3 w-3 opacity-70 shrink-0" />
          {date && !isNaN(date.getTime()) ? format(date, "dd/MM/yyyy") : <span>Set due</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

const ExpensePaymentPopover = ({
  history,
  currency,
  totalAmount,
  onAddPayment,
}: {
  history: Array<{ _id?: string; date: string; amount: number; paymentMethod?: string; note?: string }>;
  currency: string;
  totalAmount: number;
  onAddPayment: (date: string, amount: number, paymentMethod?: string, note?: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [note, setNote] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isCalOpen, setIsCalOpen] = useState(false);

  const totalPaid = history.reduce((sum, p) => sum + p.amount, 0);
  const isFullyPaid = totalAmount > 0 && totalPaid >= totalAmount;

  const handleAdd = () => {
    if (amount && date) {
      onAddPayment(date.toISOString(), Number(amount), method, note);
      setAmount("");
      setNote("");
      setDate(new Date());
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isFullyPaid}
          className={cn(
            "h-6 text-[10px] font-medium px-1.5 whitespace-nowrap",
            totalPaid > 0 && "text-blue-600 dark:text-blue-400",
            isFullyPaid && "opacity-40"
          )}
        >
          {totalPaid > 0 ? `${currency} ${totalPaid} +` : "Add Payment +"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="space-y-2.5">
          <h4 className="font-semibold text-xs">Payment History</h4>

          <div className="max-h-[130px] overflow-y-auto space-y-1">
            {history.length === 0 ? (
              <p className="text-[11px] text-slate-500">No payments recorded.</p>
            ) : (
              history.map((p, idx) => (
                <div key={p._id || idx} className="flex justify-between items-center text-[11px] border-b pb-1">
                  <div>
                    <span className="font-medium">{p.date ? format(new Date(p.date), "dd/MM/yyyy") : "-"}</span>
                    {p.paymentMethod && <span className="ml-1 text-[10px] text-slate-400">({p.paymentMethod})</span>}
                  </div>
                  <span className="font-semibold text-green-600">
                    {currency} {p.amount}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold">New Payment</span>

            <Popover open={isCalOpen} onOpenChange={setIsCalOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal h-6 text-xs px-2",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-1.5 h-3 w-3" />
                  {date ? format(date, "dd/MM/yyyy") : <span>Pick date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setIsCalOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                placeholder={`Amount (${currency})`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-6 text-xs flex-1"
              />
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="w-[75px] h-6 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1.5">
              <Input
                placeholder="Note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="h-6 text-xs flex-1"
              />
              <Button
                size="sm"
                onClick={handleAdd}
                className="h-6 px-2 text-xs"
                disabled={!amount || !date}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const AdminExpenseTableColumns = (
  handleUpdateField: (expense: ExpenseItem, data: any) => void,
  handleAddPayment: (
    expense: ExpenseItem,
    payment: { date: string; amount: number; paymentMethod?: string; note?: string }
  ) => void,
  handleDelete: (expense: ExpenseItem) => void
): ColumnDef<ExpenseItem>[] => {
  return [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const rawDate = row.original.date || row.original.createdAt;
        let formattedDate = "-";
        if (rawDate) {
          try {
            const d = new Date(rawDate);
            if (!isNaN(d.getTime())) {
              formattedDate = format(d, "dd/MM/yyyy");
            }
          } catch {
            formattedDate = "-";
          }
        }
        return <span className="text-[11px] whitespace-nowrap font-medium text-slate-700 dark:text-slate-200">{formattedDate}</span>;
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <InlineTextCell
          value={row.original.title}
          placeholder="Enter title..."
          onSave={(val) => handleUpdateField(row.original, { title: val })}
        />
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <InlineTextCell
          value={row.original.category}
          placeholder="Category..."
          onSave={(val) => handleUpdateField(row.original, { category: val })}
        />
      ),
    },
    {
      accessorKey: "vendorName",
      header: "Vendor",
      cell: ({ row }) => (
        <InlineTextCell
          value={row.original.vendorName || ""}
          placeholder="Vendor..."
          onSave={(val) => handleUpdateField(row.original, { vendorName: val })}
        />
      ),
    },
    {
      accessorKey: "billRef",
      header: "Bill No",
      cell: ({ row }) => (
        <InlineTextCell
          value={row.original.billRef || ""}
          placeholder="Bill No..."
          onSave={(val) => handleUpdateField(row.original, { billRef: val })}
        />
      ),
    },
    {
      accessorKey: "amount",
      header: "Total Cost",
      cell: ({ row }) => (
        <InlineAmountCell
          value={row.original.amount}
          currency={row.original.currency}
          onSave={(val, cur) => handleUpdateField(row.original, { amount: val, currency: cur })}
        />
      ),
    },
    {
      accessorKey: "paymentHistory",
      header: "Paid",
      cell: ({ row }) => (
        <ExpensePaymentPopover
          history={row.original.paymentHistory || []}
          currency={row.original.currency}
          totalAmount={row.original.amount || 0}
          onAddPayment={(date, amount, paymentMethod, note) =>
            handleAddPayment(row.original, { date, amount, paymentMethod, note })
          }
        />
      ),
    },
    {
      accessorKey: "balanceAmount",
      header: "Balance Due",
      cell: ({ row }) => {
        const bal = row.original.balanceAmount ?? (row.original.amount - row.original.paidAmount);
        const cur = row.original.currency || "AED";
        return (
          <span className={cn("font-medium text-[11px] whitespace-nowrap", bal > 0 ? "text-red-500" : "text-green-500")}>
            {cur} {bal}
          </span>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        const isFullyPaid = row.original.status === "paid" || (row.original.amount > 0 && row.original.paidAmount >= row.original.amount);
        return (
          <InlineDueDateCell
            value={row.original.dueDate}
            isFullyPaid={isFullyPaid}
            onSave={(val) => handleUpdateField(row.original, { dueDate: val })}
          />
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Select
          value={row.original.status || "pending"}
          onValueChange={(val) => handleUpdateField(row.original, { status: val })}
        >
          <SelectTrigger className="w-[82px] h-6 text-[10px] font-semibold px-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">
              <span className="text-orange-500">Pending</span>
            </SelectItem>
            <SelectItem value="partially_paid">
              <span className="text-blue-500">Partially Paid</span>
            </SelectItem>
            <SelectItem value="paid">
              <span className="text-[#10b981]">Paid</span>
            </SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDelete(row.original)}
          className="h-5 w-5 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          title="Delete Expense"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      ),
    },
  ];
};
