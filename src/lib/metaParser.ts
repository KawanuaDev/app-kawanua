export interface MetaTagData {
  title: string;
  description: string;
  url: string;
  siteName: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogType: string;
  ogUrl: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterSite: string;
  favicon: string;
  canonical: string;
  robots: string;
  viewport: string;
  charset: string;
  allTags: { name: string; content: string; property?: string }[];
}

export async function fetchMetaTags(url: string): Promise<MetaTagData> {
  let formattedUrl = url.trim();
  if (
    !formattedUrl.startsWith("http://") &&
    !formattedUrl.startsWith("https://")
  ) {
    formattedUrl = `https://${formattedUrl}`;
  }

  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(formattedUrl)}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const getMeta = (attr: string, value: string): string => {
    const el =
      doc.querySelector(`meta[name="${value}"]`) ||
      doc.querySelector(`meta[property="${value}"]`) ||
      doc.querySelector(`meta[${attr}="${value}"]`);
    return el?.getAttribute("content") || "";
  };

  const allTags: MetaTagData["allTags"] = [];
  doc.querySelectorAll("meta").forEach((el) => {
    const name =
      el.getAttribute("name") ||
      el.getAttribute("property") ||
      el.getAttribute("http-equiv") ||
      "";
    const content =
      el.getAttribute("content") || el.getAttribute("charset") || "";
    if (name || content) {
      allTags.push({
        name,
        content,
        property: el.getAttribute("property") || undefined,
      });
    }
  });

  const faviconEl = doc.querySelector(
    'link[rel="icon"], link[rel="shortcut icon"]',
  );
  let favicon = faviconEl?.getAttribute("href") || "";
  if (favicon && !favicon.startsWith("http")) {
    const base = new URL(formattedUrl);
    favicon = favicon.startsWith("/")
      ? `${base.origin}${favicon}`
      : `${base.origin}/${favicon}`;
  }

  const canonicalEl = doc.querySelector('link[rel="canonical"]');

  return {
    title: doc.querySelector("title")?.textContent || "",
    description: getMeta("name", "description"),
    url: formattedUrl,
    siteName: getMeta("property", "og:site_name"),
    ogTitle: getMeta("property", "og:title"),
    ogDescription: getMeta("property", "og:description"),
    ogImage: getMeta("property", "og:image"),
    ogType: getMeta("property", "og:type"),
    ogUrl: getMeta("property", "og:url"),
    twitterCard: getMeta("name", "twitter:card"),
    twitterTitle: getMeta("name", "twitter:title"),
    twitterDescription: getMeta("name", "twitter:description"),
    twitterImage: getMeta("name", "twitter:image"),
    twitterSite: getMeta("name", "twitter:site"),
    favicon,
    canonical: canonicalEl?.getAttribute("href") || "",
    robots: getMeta("name", "robots"),
    viewport: getMeta("name", "viewport"),
    charset: doc.querySelector("meta[charset]")?.getAttribute("charset") || "",
    allTags,
  };
}
