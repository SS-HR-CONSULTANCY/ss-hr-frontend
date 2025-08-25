import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type UseFormRegister, type FieldValues, type Path } from "react-hook-form";


interface FormFieldProps<T extends FieldValues> {
  id: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  register: UseFormRegister<T>;
  showTogglePassword?: boolean;
  children?: React.ReactNode;
}

const FormField = <T extends FieldValues>({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
  error,
  register,
  showTogglePassword = false,
  children
}: FormFieldProps<T>) => {
  const [show, setShow] = useState(false);

   if (type === "select") {
    return (
      <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <select
          id={id}
          {...register(id)}
          className={`w-full border rounded p-2 ${error ? "border-destructive" : ""}`}
        >
          {children}
        </select>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  const inputType =
    showTogglePassword && (type === "password" || type === "text")
      ? show
        ? "text"
        : "password"
      : type;

  return (
    <div className="space-y-2">
      <Label className="text-xs md:text-sm" htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={inputType}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`${error ? "border-destructive" : ""} text-sm`}
          {...register(id)}
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
