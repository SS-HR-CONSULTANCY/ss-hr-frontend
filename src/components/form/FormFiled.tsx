import {
  type Path,
  type FieldValues,
  type UseFormRegister,
  type RegisterOptions,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Eye, EyeOff, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormFieldProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  register: UseFormRegister<T>;
  registerOptions?: RegisterOptions<T, Path<T>>;
  showTogglePassword?: boolean;
  options?: {
    label: string;
    value: string;
  }[];
  defaultSelectOptions?: string;
  onFileSelect?: (url: string) => void;
  rows?: number;
  defaultValue?: string | number | boolean | string[] | FileList;
  readOnly?: boolean;
  required?: boolean;
  accept?: string;
  info?: string;
}

const FormField = <T extends FieldValues>({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
  error,
  register,
  registerOptions,
  showTogglePassword = false,
  options,
  defaultSelectOptions,
  onFileSelect,
  rows = 3,
  defaultValue,
  readOnly,
  required = false,
  accept = "image/png, image/jpeg",
  info
}: FormFieldProps<T>) => {
  const [show, setShow] = useState(false);

  // ✅ File input
  if (type === "file") {
    return (
      <div className="flex flex-col space-y-2">
        <Label className="text-xs md:text-sm" htmlFor={id}>
          {label} {required && (<span className="mx-1 text-red-500">*</span>)} {info && (
            <span
              className="ml-1 cursor-pointer text-gray-500 text-xs relative group"
            >
              <Info className="size-4" />
              <span className="
        absolute left-1/2 -translate-x-1/2 top-full mt-1
        whitespace-nowrap
        bg-black text-white text-[10px] px-2 py-1 rounded-md shadow
        opacity-0 group-hover:opacity-100 transition-opacity
      ">
                {info}
              </span>
            </span>
          )}
        </Label>
        <Input
          id={id}
          type="file"
          accept={accept}
          required={required}
          {...register(id, registerOptions)}
          onChange={(e) => {
            const file: File | undefined = (e.target as HTMLInputElement)
              .files?.[0];
            if (file && onFileSelect) {
              const imageUrl = URL.createObjectURL(file);
              onFileSelect(imageUrl);
            }
            registerOptions?.onChange?.(e);
          }}
          className={`${error ? "border-destructive" : ""} text-sm border border-black`}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  // ✅ Select input
  if (type === "select") {
    return (
      <div className="space-y-2">
        <Label className="text-xs md:text-sm" htmlFor={id}>{label}{required && (<span className="mx-1 text-red-500">*</span>)}</Label>
        <select
          id={id}
          {...register(id, registerOptions)}
           required={required}
          className={cn("file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]", "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",)} > <option value="" className="dark:text-black">Select {defaultSelectOptions}</option> {options?.map((opt) => (<option key={opt.value} value={opt.value} className="dark:text-black"> {opt.label} </option>))} </select>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  // ✅ Textarea
  if (type === "textarea") {
    return (
      <div className="space-y-2">
        <Label className="text-xs md:text-sm" htmlFor={id}>
          {label}{required && (<span className="mx-1 text-red-500">*</span>)}
        </Label>
        <textarea
          id={id}
          required={required}
          defaultValue={defaultValue as string}
          rows={rows}
          readOnly={readOnly}
          placeholder={placeholder}
          {...register(id, registerOptions)}
          className={`w-full border rounded p-2 text-sm border-black ${error ? "border-destructive" : ""}`}
        />
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  // ✅ Default input + password toggle
  const inputType =
    showTogglePassword && (type === "password" || type === "text")
      ? show
        ? "text"
        : "password"
      : type;

  return (
    <div className="space-y-2">
      <Label className="text-xs md:text-sm" htmlFor={id}>
        {label}{required && (<span className="mx-1 text-red-500">*</span>)}
      </Label>
      <div className="relative">
        <Input
          id={id}
          required={required}
          type={inputType}
          readOnly={readOnly}
          autoComplete={autoComplete}
          defaultValue={defaultValue as string | number}
          placeholder={placeholder}
          className={`${error ? "border-destructive" : ""} text-sm`}
          {...register(id, registerOptions)}
        />
        {showTogglePassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
          >
            {show ? <EyeOff /> : <Eye />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
};

export default FormField;
