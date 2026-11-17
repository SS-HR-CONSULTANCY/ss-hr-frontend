import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface StaffOption {
  _id: string;
  fullName?: string;
  username?: string;
}

interface StaffMultiSelectProps {
  staff: StaffOption[];
  /** Currently selected staff ids */
  value: string[];
  /** Dropdown: fired once when the dropdown closes with a changed selection. Inline: fired on every toggle. */
  onChange: (ids: string[]) => void;
  /** Render the checkbox list directly (e.g. inside a dialog) instead of a dropdown */
  inline?: boolean;
  disabled?: boolean;
}

const label = (s: StaffOption) => s.fullName || s.username || s._id;

const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));

export default function StaffMultiSelect({ staff, value, onChange, inline, disabled }: StaffMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>(value);

  // Keep the draft in sync with the saved value whenever the dropdown is closed
  useEffect(() => {
    if (!open) setDraft(value);
  }, [value, open]);

  const toggle = (id: string) => {
    const base = inline ? value : draft;
    const next = base.includes(id) ? base.filter((x) => x !== id) : [...base, id];
    if (inline) onChange(next);
    else setDraft(next);
  };

  const list = (selected: string[]) =>
    staff.length === 0 ? (
      <p className="text-xs text-gray-500 px-1 py-1">No staff available</p>
    ) : (
      staff.map((s) => (
        <label
          key={s._id}
          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <input
            type="checkbox"
            checked={selected.includes(s._id)}
            onChange={() => toggle(s._id)}
            className="accent-indigo-600"
          />
          {label(s)}
        </label>
      ))
    );

  if (inline) {
    return (
      <div className="max-h-36 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 p-1">
        {list(value)}
      </div>
    );
  }

  const names = value.map((id) => staff.find((s) => s._id === id)).filter(Boolean).map((s) => label(s!));

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next && !sameSet(draft, value)) onChange(draft);
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          title={names.join(", ") || "Unassigned"}
          className="w-full min-w-[110px] flex items-center justify-between gap-1 text-[11px] py-1 px-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <span className="truncate text-left">
            {names.length === 0 ? "Unassigned" : names.length === 1 ? names[0] : `${names[0]} +${names.length - 1}`}
          </span>
          <ChevronDown className="w-3 h-3 shrink-0 opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-52 p-1.5 max-h-64 overflow-y-auto">
        {list(draft)}
      </PopoverContent>
    </Popover>
  );
}
