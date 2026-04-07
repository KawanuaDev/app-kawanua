import { useState } from "react";
import { Search, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WhoisSearchProps {
  onSearch: (domain: string) => void;
  isLoading: boolean;
}

const WhoisSearch = ({ onSearch, isLoading }: WhoisSearchProps) => {
  const [domain, setDomain] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (domain.trim()) {
      onSearch(domain.trim());
    }
  };

  return (
    <section className="text-center space-y-8 py-16 md:py-24">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
          <Globe className="h-3.5 w-3.5 text-primary" />
          Domain Intelligence Tool
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          <span className="text-foreground">WHOIS</span>{" "}
          <span className="text-gradient">Lookup</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Cari informasi registrasi domain secara instan. Masukkan nama domain untuk memulai.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="contoh: google.com"
            className="h-12 pl-11 bg-secondary border-border text-foreground placeholder:text-muted-foreground font-mono text-sm focus-visible:ring-primary"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !domain.trim()}
          className="h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Mencari...
            </>
          ) : (
            "Lookup"
          )}
        </Button>
      </form>
    </section>
  );
};

export default WhoisSearch;
