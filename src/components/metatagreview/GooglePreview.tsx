import type { MetaTagData } from "@/lib/metaParser";

export const GooglePreview = ({ data }: { data: MetaTagData }) => {
  const title = data.ogTitle || data.title || "No title";
  const desc =
    data.ogDescription || data.description || "No description available.";
  const displayUrl = data.canonical || data.ogUrl || data.url;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Google Preview
      </h3>
      <div className="rounded-lg bg-[hsl(0,0%,100%)] p-5 space-y-1">
        <p className="text-sm text-[hsl(120,1%,34%)] truncate">{displayUrl}</p>
        <h4 className="text-xl text-[hsl(217,89%,51%)] font-normal leading-snug line-clamp-1 hover:underline cursor-pointer">
          {title}
        </h4>
        <p className="text-sm text-[hsl(0,0%,27%)] line-clamp-2 leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
};
