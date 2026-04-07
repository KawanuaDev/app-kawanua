import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, XCircle, Info } from "lucide-react";

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "destructive" | "success" | "warning";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-slate-50 border-slate-200 text-slate-800",
    destructive: "bg-red-50 border-red-200 text-red-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  };

  const icons = {
    default: <Info className="h-4 w-4" />,
    destructive: <XCircle className="h-4 w-4" />,
    success: <CheckCircle2 className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />,
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "border rounded-lg p-4 flex items-start gap-3",
        variants[variant],
        className,
      )}
      {...props}
    >
      {icons[variant]}
      <div className="flex-1">{props.children}</div>
    </div>
  );
});
Alert.displayName = "Alert";

export { Alert };
