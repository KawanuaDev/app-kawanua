import { ScanApiResponse } from "@/types/securityscan";

const API_BASE = "https://altor.fetch.pp.ua/scan";

export async function fetchSecurityScan(domain: string): Promise<ScanApiResponse> {
  // Strip protocol if accidentally included
  const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "").trim();

  if (!cleanDomain) throw new Error("Domain tidak boleh kosong.");

  const res = await fetch(`${API_BASE}/${encodeURIComponent(cleanDomain)}`);

  if (!res.ok) {
    throw new Error(`Server merespons dengan status ${res.status}.`);
  }

  const json: ScanApiResponse = await res.json();

  if (json.status !== "success") {
    throw new Error("API mengembalikan status gagal.");
  }

  return json;
}
