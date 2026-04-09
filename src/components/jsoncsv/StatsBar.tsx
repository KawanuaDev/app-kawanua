import { Badge } from "@/components/ui/badge";
import { Rows3, Columns3, HardDrive } from "lucide-react";

interface StatsBarProps {
  rows?: number;
  columns?: number;
  size?: string;
}

export default function StatsBar({ rows, columns, size }: StatsBarProps) {
  if (rows === undefined && columns === undefined && size === undefined)
    return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {rows !== undefined && (
        <Badge variant="secondary" className="gap-1.5 text-xs font-normal">
          <Rows3 className="size-3" />
          {rows.toLocaleString()} rows
        </Badge>
      )}
      {columns !== undefined && columns > 0 && (
        <Badge variant="secondary" className="gap-1.5 text-xs font-normal">
          <Columns3 className="size-3" />
          {columns.toLocaleString()} columns
        </Badge>
      )}
      {size && (
        <Badge variant="secondary" className="gap-1.5 text-xs font-normal">
          <HardDrive className="size-3" />
          {size}
        </Badge>
      )}
    </div>
  );
}
