import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AppHome from "../components/dash/AppHome";
import { data } from "@/lib/data";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <div className="bg-background bg-grid flex items-start justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(200_80%_55%/0.10),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(200_80%_40%/0.08),transparent_50%)]" />

      <div className="w-full md:max-w-6xl lg:max-w-screen-2xl space-y-6 pb-10 z-10">
        <HeroCard />
        <HighlightCard />
        <AppHome />
      </div>
    </div>
  );
}

function HeroCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-white/60 shadow-2xl mb-16">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
        style={{
          backgroundImage: `url('/assets/imgs/bg_co4pcaco4pcaco4p.png')`,
        }}
      />

      {/* Overlays for depth and readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
      <div className="absolute inset-0 z-0 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center px-8 py-16 md:px-12 md:py-20 lg:px-16">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
            Kawanua ID{" "}
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Apps
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 font-medium leading-relaxed max-w-lg drop-shadow-lg">
            Kawanua ID Apps adalah kumpulan aplikasi untuk membantu Anda dalam
            berbagai hal.
          </p>
          <div className="flex gap-4 pt-4 animate-in fade-in slide-in-from-left-4 duration-1000">
            <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-transparent rounded-full" />
          </div>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 size-96 bg-blue-600/20 blur-[120px] rounded-full" />
    </div>
  );
}

function HighlightCard() {
  const highlightApps = data.navMain
    .flatMap((group) =>
      (group.items ?? []).map((item) => ({
        ...item,
        category: group.title,
      })),
    )
    .filter((app) => app.isHighlight);
  // .sort((a, b) => b.title.localeCompare(a.title));

  return (
    <div className="p-6 h-full">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Selamat Datang 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Mulai dengan aplikasi pilihan Developer kami berikut.
          </p>
        </div>
        {/* <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 z-10 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari aplikasi, kategori..."
            className="w-full pl-9 bg-background/60 backdrop-blur-sm"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div> */}
      </div>
      <div className="flex items-center justify-center">
        <Carousel
          opts={{
            align: "start",
            // loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          className="w-full max-w-[12rem] sm:max-w-xs md:max-w-6xl"
        >
          <CarouselContent>
            {highlightApps.map((app, index) => {
              const Icon = app.icon;
              return (
                <CarouselItem key={index} className="basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Link to={app.url}>
                      <Card className="group relative flex flex-col justify-end overflow-hidden rounded-xl border min-h-[250px] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-border">
                        {/* Background Image Layer */}
                        {app.cover && (
                          <div
                            className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                            style={{ backgroundImage: `url('${app.cover}')` }}
                          />
                        )}

                        <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/10" />

                        {/* Content Layer */}
                        <div className="relative z-10 flex flex-col gap-3 mt-auto">
                          <div className="flex w-10 h-10 items-center justify-center rounded-lg bg-gradient-to-br backdrop-blur-md border border-border/50 shadow-sm group-hover:scale-110 bg-background transition-all duration-300">
                            {Icon && (
                              <Icon className="size-5 text-foreground" />
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5 p-0">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 drop-shadow-sm">
                              {app.category}
                            </span>
                            <h3 className="font-semibold leading-tight text-lg text-slate-100 drop-shadow-sm">
                              {app.title}
                            </h3>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
