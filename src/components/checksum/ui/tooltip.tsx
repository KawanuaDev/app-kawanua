import * as React from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  className?: string;
}

export function Tooltip({ children, content, className }: TooltipProps) {
  return (
    <div className={cn("group relative inline-block", className)}>
      {children}
      <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg group-hover:flex group-hover:opacity-100 dark:bg-slate-50 dark:text-slate-900 whitespace-nowrap z-50">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-50" />
      </div>
    </div>
  );
}
