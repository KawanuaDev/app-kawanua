import type { MetaTagData } from "@/lib/metaParser";

export const TwitterPreview = ({ data }: { data: MetaTagData }) => {
  const title = data.twitterTitle || data.ogTitle || data.title || "No title";
  const desc =
    data.twitterDescription || data.ogDescription || data.description || "";
  const image = data.twitterImage || data.ogImage;
  const domain = (() => {
    try {
      return new URL(data.url).hostname;
    } catch {
      return data.url;
    }
  })();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Twitter / X Preview
      </h3>
      <div className="rounded-2xl overflow-hidden border border-[hsl(200,8%,20%)] bg-[hsl(200,10%,4%)]">
        {image && (
          <div className="aspect-[2/1] bg-[hsl(200,8%,12%)] overflow-hidden">
            <img
              src={image}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
        )}
        <div className="p-3 space-y-0.5">
          <h4 className="text-[15px] font-normal text-[hsl(0,0%,95%)] line-clamp-1">
            {title}
          </h4>
          <p className="text-sm text-[hsl(0,0%,55%)] line-clamp-2">{desc}</p>
          <p className="text-sm text-[hsl(0,0%,55%)]">{domain}</p>
        </div>
      </div>
    </div>
  );
};
