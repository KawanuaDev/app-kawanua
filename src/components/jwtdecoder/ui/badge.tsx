import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-2 px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-slate-900 text-white shadow-sm hover:bg-slate-800",
        secondary:
          "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200",
        destructive:
          "border-transparent bg-red-600 text-white shadow-sm hover:bg-red-700",
        outline: "border-slate-300 text-slate-700 bg-white hover:bg-slate-50",
        success:
          "border-transparent bg-emerald-500 text-white shadow-sm hover:bg-emerald-600",
        warning:
          "border-transparent bg-amber-500 text-white shadow-sm hover:bg-amber-600",
        info: "border-transparent bg-indigo-500 text-white shadow-sm hover:bg-indigo-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
