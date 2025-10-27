import {
  type Path,
  type FieldValues,
  type UseFormRegister,
  type RegisterOptions,
} from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
  children?: React.ReactNode;
  onFileSelect?: (url: string) => void;
  rows?: number; // ✅ for textarea
  defaultValue?: string | number | boolean;
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
  children,
  onFileSelect,
  rows = 3,
  defaultValue,
}: FormFieldProps<T>) => {
  const [show, setShow] = useState(false);

  // ✅ File input
  if (type === "file") {
    return (
      <div className="flex flex-col space-y-2">
        <Label className="text-xs md:text-sm" htmlFor={id}>
          {label}
        </Label>
        <Input
          id={id}
          type="file"
          accept="image/*"
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
        <Label htmlFor={id}>{label}</Label>
        <select
          id={id}
          {...register(id, registerOptions)}
          className={`w-full border rounded p-2 border border-black ${error ? "border-destructive" : ""}`}
        >
          {children}
        </select>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  // ✅ Textarea
  if (type === "textarea") {
    return (
      <div className="space-y-2">
        <Label className="text-xs md:text-sm" htmlFor={id}>
          {label}
        </Label>
        <textarea
          id={id}
          defaultValue={defaultValue as string}
          rows={rows}
          placeholder={placeholder}
          {...register(id, registerOptions)}
          className={`w-full border rounded p-2 text-sm border border-black ${error ? "border-destructive" : ""}`}
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
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={inputType}
          autoComplete={autoComplete}
          defaultValue={defaultValue as string | number}
          placeholder={placeholder}
          className={`${error ? "border-destructive" : ""} text-sm border border-black`}
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
