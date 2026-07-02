import * as React from "react";
import { cn } from "~/lib/utils";

export interface FormFieldProps extends React.ComponentProps<"div"> {
  label?: string;
  /** id of the control this field labels. */
  htmlFor?: string;
  description?: string;
  error?: string;
  required?: boolean;
}

/**
 * Library-agnostic field wrapper: label, control (children), and a single
 * hint/error line. It does not own form state — pair it with any input and any
 * form library. When `error` is set it replaces the description.
 */
export function FormField({
  label,
  htmlFor,
  description,
  error,
  required,
  className,
  children,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)} {...props}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block font-inconsolata text-xs font-medium uppercase tracking-wider text-neutral-500"
        >
          {label}
          {required && <span className="text-destructive"> *</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : description ? (
        <p className="text-xs text-neutral-500">{description}</p>
      ) : null}
    </div>
  );
}
