import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "success" | "warning" | "danger";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        {
          "bg-slate-100 text-slate-700": variant === "default",
          "bg-slate-50 text-slate-600 border border-slate-200":
            variant === "secondary",
          "bg-emerald-100 text-emerald-700": variant === "success",
          "bg-amber-100 text-amber-700": variant === "warning",
          "bg-red-100 text-red-700": variant === "danger",
        },
        className,
      )}
      {...props}
    />
  );
}
