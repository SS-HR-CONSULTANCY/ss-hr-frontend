import { toast } from "sonner";
import type { FieldErrors, Path, UseFormSetFocus } from "react-hook-form";

export const handleFormError =
  <T extends Record<string, string | number | boolean | "" | undefined | null>>(
    setFocus: UseFormSetFocus<T>,
  ) =>
  (errors: FieldErrors<T>) => {
    const firstErrorField = Object.keys(errors)[0] as Path<T> | undefined;

    if (firstErrorField) {
      setFocus(firstErrorField);
    }

    toast.error("Please fix the highlighted fields.");
  };
