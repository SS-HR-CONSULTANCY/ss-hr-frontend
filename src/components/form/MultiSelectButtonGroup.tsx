import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { type FieldValues, type Path, type UseFormSetValue } from "react-hook-form";

interface MultiSelectButtonGroupProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  options: { label: string; value: string }[];
  selectedValues: string[];
  setValue: UseFormSetValue<T>;
  disabled?: boolean;
  error?: string;
}

export const MultiSelectButtonGroup = <T extends FieldValues>({
  id,
  label,
  options,
  selectedValues,
  setValue,
  disabled,
  error,
}: MultiSelectButtonGroupProps<T>) => {
  const toggleSelect = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];

    // ✅ Type-safe: explicitly assert that this field is an array of strings
    setValue(id, newValues as T[typeof id], { shouldValidate: true });
  };

  return (
    <div className="space-y-2">
      <Label className="text-xs md:text-sm">{label} <span className="mx-2 font-semibold text-red-500">Multiple Selection</span></Label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = selectedValues.includes(option.value);
          return (
            <Badge
              key={option.value}
              variant={selected ? "default" : "outline"}
              onClick={() => !disabled && toggleSelect(option.value)}
              className={cn(
                "cursor-pointer select-none transition-all px-3 py-1 text-sm",
                disabled && "opacity-50 pointer-events-none",
                selected ? "bg-primary text-white" : "hover:bg-accent"
              )}
            >
              {option.label}
            </Badge>
          );
        })}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};
