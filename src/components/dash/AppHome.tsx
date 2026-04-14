import { useState } from "react";
import { Link } from "react-router-dom";
import { data, defaultMeta } from "@/lib/data";
import { KeyRound, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NavItem } from "@/types/dashboard";

interface AppItem extends NavItem {
  category: string;
}

export default function AppHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Flatten all navMain items into a single list and sort A-Z
  const allApps: (AppItem & { category: string })[] = data.navMain
    .flatMap((group) =>
      (group.items ?? []).map((item) => ({
        ...item,
        category: group.title,
      })),
    )
    .sort((a, b) => a.title.localeCompare(b.title));

  const filteredApps = allApps.filter((app) => {
    const searchLower = searchQuery.toLowerCase();
    const description = app.description || defaultMeta.description;
    return (
      app.title.toLowerCase().includes(searchLower) ||
      app.category.toLowerCase().includes(searchLower) ||
      description.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApps = filteredApps.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 h-full">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-primary font-extrabold">
              {filteredApps.length}
            </span>{" "}
            Apps
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Cari dan coba semua aplikasi yang tersedia.
          </p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 z-10 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari aplikasi, kategori..."
            className="w-full pl-9 bg-background/60 backdrop-blur-sm"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Cards Grid */}
      {filteredApps.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed bg-muted/30">
          <Search className="size-8 text-muted-foreground/50 mb-3" />
          <h3 className="text-lg font-medium">Aplikasi tidak ditemukan</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Tidak ada aplikasi yang cocok dengan pencarian &quot;{searchQuery}
            &quot;.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {paginatedApps.map((app) => {
          const accent = app.accent || defaultMeta.accent;
          const description = app.description || defaultMeta.description;
          const Icon = app.icon ?? KeyRound;

          return (
            <Link key={app.url} to={app.url}>
              <article id={"card" + app.url.replace("/", "-")}>
                <Card
                  className={cn(
                    "group relative flex flex-col justify-end overflow-hidden rounded-xl border min-h-[250px] p-5",
                    "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
                    accent.match(/border-\S+/g)?.join(" ") || "border-border",
                  )}
                >
                  {/* Background Image Layer */}
                  {app.cover && (
                    <div
                      className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                      style={{ backgroundImage: `url('${app.cover}')` }}
                    />
                  )}

                  {/* Bottom-to-Top Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/10" />

                  {/* Content Layer */}
                  <div className="relative z-10 flex flex-col gap-3 mt-auto">
                    <div
                      className={cn(
                        "flex w-10 h-10 items-center justify-center rounded-lg bg-gradient-to-br backdrop-blur-md border border-border/50 shadow-sm group-hover:scale-110 bg-background transition-all duration-300",
                        accent,
                      )}
                    >
                      <Icon className="size-5 text-foreground" />
                    </div>
                    <CardHeader className="flex flex-col gap-0.5 p-0">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 drop-shadow-sm">
                        {app.category}
                      </span>
                      <CardTitle className="leading-tight text-lg text-slate-100 drop-shadow-sm">
                        {app.title}
                      </CardTitle>
                      <CardDescription className="leading-snug text-slate-200/70 line-clamp-2">
                        {description}
                      </CardDescription>
                    </CardHeader>
                  </div>
                </Card>
              </article>
            </Link>
            // <Link
            //   key={app.url}
            //   to={app.url}
            //   className="link-card overflow-hidden translate-y-0 hover:-translate-y-[2px] transition-all duration-200 rounded-lg relative"
            // >
            //   <article className={"card" + app.url.replace("/", "-")}>
            //     <Card
            //       className={cn(
            //         "group flex flex-col md:flex-row gap-4 rounded-xl border border-primary bg-slate-100 bg-gradient-to-br p-5",
            //         // "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg",
            //         // meta.accent,
            //       )}
            //     >
            //       <div className="flex w-1/6 size-12 items-center justify-center rounded-lg bg-background/60 backdrop-blur-sm border border-border/50 shadow-sm group-hover:scale-110 transition-transform duration-200">
            //         <Icon className="size-6 text-foreground" />
            //       </div>
            //       <CardHeader className="flex w-5/6 flex-col gap-0.5 p-0">
            //         <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            //           {app.category}
            //         </span>
            //         <CardTitle className="leading-tight">{app.title}</CardTitle>
            //         <CardDescription className="leading-snug">
            //           {(appMeta[app.url] ?? defaultMeta).description}
            //         </CardDescription>
            //       </CardHeader>
            //     </Card>
            //   </article>
            // </Link>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <div className="flex items-center gap-2 px-4 text-sm font-medium">
            Halaman {currentPage} dari {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
