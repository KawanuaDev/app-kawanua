import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Server, Shield, Clock, Globe, Building, Mail } from "lucide-react";

export interface WhoisData {
  domainName: string;
  registrar: string;
  registrant: string;
  organization: string;
  email: string;
  createdDate: string;
  expiryDate: string;
  updatedDate: string;
  status: string[];
  nameServers: string[];
  dnssec: string;
  country: string;
}

interface WhoisResultProps {
  data: WhoisData;
}

const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
    <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
    <div className="min-w-0 flex-1">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-sm text-foreground font-mono mt-0.5 break-all">{value}</p>
    </div>
  </div>
);

const WhoisResult = ({ data }: WhoisResultProps) => {
  const isExpiringSoon = () => {
    const expiry = new Date(data.expiryDate);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    return diff < 30 * 24 * 60 * 60 * 1000 && diff > 0;
  };

  const isExpired = () => new Date(data.expiryDate) < new Date();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Domain header */}
      <div className="flex items-center gap-3 flex-wrap">
        <h2 className="text-2xl font-bold font-mono text-foreground">{data.domainName}</h2>
        {isExpired() ? (
          <Badge variant="destructive">Expired</Badge>
        ) : isExpiringSoon() ? (
          <Badge className="bg-warning text-primary-foreground">Expiring Soon</Badge>
        ) : (
          <Badge className="bg-success text-primary-foreground">Active</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Registration Info */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Informasi Registrasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow icon={Building} label="Registrar" value={data.registrar} />
            <InfoRow icon={User} label="Registrant" value={data.registrant} />
            <InfoRow icon={Building} label="Organisasi" value={data.organization} />
            <InfoRow icon={Mail} label="Email" value={data.email} />
            <InfoRow icon={Globe} label="Negara" value={data.country} />
          </CardContent>
        </Card>

        {/* Dates */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Tanggal Penting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InfoRow icon={Calendar} label="Dibuat" value={data.createdDate} />
            <InfoRow icon={Clock} label="Kadaluarsa" value={data.expiryDate} />
            <InfoRow icon={Clock} label="Terakhir Diperbarui" value={data.updatedDate} />
            <InfoRow icon={Shield} label="DNSSEC" value={data.dnssec} />
          </CardContent>
        </Card>

        {/* Name Servers */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-foreground flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              Name Servers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.nameServers.map((ns, i) => (
                <div key={i} className="flex items-center gap-2 py-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-sm font-mono text-foreground">{ns}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Status Domain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.status.map((s, i) => (
                <Badge key={i} variant="secondary" className="font-mono text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhoisResult;
