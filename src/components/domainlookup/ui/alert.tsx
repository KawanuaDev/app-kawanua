import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
}

export function Alert({ className, variant = "info", ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-xl border-2 p-4",
        {
          "border-blue-200 bg-blue-50 text-blue-800": variant === "info",
          "border-emerald-200 bg-emerald-50 text-emerald-800":
            variant === "success",
          "border-amber-200 bg-amber-50 text-amber-800": variant === "warning",
          "border-red-200 bg-red-50 text-red-800": variant === "error",
        },
        className,
      )}
      {...props}
    />
  );
}

export const AlertDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("text-sm", className)} {...props} />
);
