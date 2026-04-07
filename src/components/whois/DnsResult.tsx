import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Mail, FileText, Link2, ArrowRight } from "lucide-react";

export interface DnsRecord {
  type: "A" | "AAAA" | "MX" | "CNAME" | "TXT" | "NS";
  name: string;
  value: string;
  ttl: number;
  priority?: number;
}

export interface DnsData {
  domainName: string;
  records: DnsRecord[];
}

interface DnsResultProps {
  data: DnsData;
}

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  A: { icon: Globe, color: "bg-primary text-primary-foreground" },
  AAAA: { icon: Globe, color: "bg-info text-primary-foreground" },
  MX: { icon: Mail, color: "bg-warning text-primary-foreground" },
  CNAME: { icon: Link2, color: "bg-success text-primary-foreground" },
  TXT: { icon: FileText, color: "bg-secondary text-secondary-foreground" },
  NS: { icon: ArrowRight, color: "bg-muted text-foreground" },
};

const DnsResult = ({ data }: DnsResultProps) => {
  const recordTypes = ["A", "AAAA", "MX", "CNAME", "TXT", "NS"] as const;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold font-mono text-foreground">
        DNS Records — {data.domainName}
      </h2>

      {recordTypes.map((type) => {
        const records = data.records.filter((r) => r.type === type);
        if (records.length === 0) return null;
        const config = typeConfig[type];
        const Icon = config.icon;

        return (
          <Card key={type} className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-foreground flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" />
                {type} Records
                <Badge className={config.color}>{records.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                      <th className="text-left py-2 pr-4">Name</th>
                      {type === "MX" && <th className="text-left py-2 pr-4">Priority</th>}
                      <th className="text-left py-2 pr-4">Value</th>
                      <th className="text-right py-2">TTL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="py-2.5 pr-4 font-mono text-foreground">{record.name}</td>
                        {type === "MX" && (
                          <td className="py-2.5 pr-4 font-mono text-primary">{record.priority}</td>
                        )}
                        <td className="py-2.5 pr-4 font-mono text-foreground break-all">{record.value}</td>
                        <td className="py-2.5 text-right font-mono text-muted-foreground">{record.ttl}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DnsResult;
