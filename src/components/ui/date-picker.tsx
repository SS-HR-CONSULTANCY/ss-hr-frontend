// import { CalendarIcon } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";  
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";
// import { useState } from "react";

// interface DateFieldProps {
//   label: string;
//   value?: Date | null;
//   onChange: (date: Date | undefined) => void;
//   disabled?: boolean;
//   required: boolean;
// }

// export function DateField({ label, value, onChange, disabled, required }: DateFieldProps) {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="space-y-2">
//       <label className="text-sm font-medium">{label} {required && (<span className="mx-1 text-red-500">*</span>)} </label>
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             disabled={disabled}
//              className={cn(
//                   "justify-start",
//                   "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//                   "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
//                   "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
//                 )}
//           >
//             <CalendarIcon className="mr-2 h-4 w-4" />
//             {value ? format(value, "PPP") : "Pick a date"}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar
//             mode="single"
//             selected={value}
//             onSelect={onChange}
//             initialFocus
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }




import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DateFieldProps {
  label: string;
  value?: Date | null;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
  required?: boolean;
}

export function DateField({
  label,
  value,
  onChange,
  disabled,
  required,
}: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(value?.getMonth() ?? new Date().getMonth());
  const [year, setYear] = useState(value?.getFullYear() ?? new Date().getFullYear());

  // Generate years from 1950 to current year
  const years = Array.from(
    { length: new Date().getFullYear() - 1950 + 1 },
    (_, i) => 1950 + i
  ).reverse();

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="mx-1 text-red-500">*</span>}
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "justify-start text-left font-normal",
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none",
              "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-3" align="start">
          {/* Month & Year selectors */}
          <div className="flex gap-2 mb-2">
            <Select
              value={month.toString()}
              onValueChange={(val) => setMonth(parseInt(val))}
            >
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {format(new Date(0, i), "MMMM")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={year.toString()}
              onValueChange={(val) => setYear(parseInt(val))}
            >
              <SelectTrigger className="w-[100px] h-8">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Calendar */}
          <Calendar
            mode="single"
            selected={value ?? undefined}
            onSelect={onChange}
            month={new Date(year, month)}
            onMonthChange={(date) => {
              setMonth(date.getMonth());
              setYear(date.getFullYear());
            }}
            disabled={(date) => date > new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}


