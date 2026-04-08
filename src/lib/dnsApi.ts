import { DnsRecord, DnsData } from "@/components/whois/DnsResult";

const GOOGLE_DOH_URL = "https://dns.google/resolve";

type DnsRecordType = "A" | "AAAA" | "MX" | "CNAME" | "TXT" | "NS";

const RECORD_TYPE_MAP: Record<DnsRecordType, number> = {
  A: 1,
  AAAA: 28,
  MX: 15,
  CNAME: 5,
  TXT: 16,
  NS: 2,
};

interface GoogleDnsAnswer {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

interface GoogleDnsResponse {
  Answer?: GoogleDnsAnswer[];
}

const typeNumToStr: Record<number, DnsRecordType> = {
  1: "A",
  28: "AAAA",
  15: "MX",
  5: "CNAME",
  16: "TXT",
  2: "NS",
};

async function queryDnsType(
  domain: string,
  type: DnsRecordType,
): Promise<DnsRecord[]> {
  const typeNum = RECORD_TYPE_MAP[type];
  const res = await fetch(
    `${GOOGLE_DOH_URL}?name=${encodeURIComponent(domain)}&type=${typeNum}`,
  );
  if (!res.ok) return [];
  const data: GoogleDnsResponse = await res.json();
  if (!data.Answer) return [];

  return data.Answer.filter((a) => typeNumToStr[a.type] === type).map((a) => {
    const name = a.name.endsWith(".") ? a.name.slice(0, -1) : a.name;
    let value = a.data;
    let priority: number | undefined;

    if (type === "MX") {
      const parts = value.split(" ");
      if (parts.length >= 2) {
        priority = parseInt(parts[0], 10);
        value = parts.slice(1).join(" ");
      }
    }

    // Remove surrounding quotes from TXT records
    if (type === "TXT" && value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    // Remove trailing dot
    if (value.endsWith(".")) value = value.slice(0, -1);

    return {
      type,
      name: name === domain ? "@" : name.replace(`.${domain}`, ""),
      value,
      ttl: a.TTL,
      ...(priority !== undefined && { priority }),
    };
  });
}

export async function fetchDnsRecords(domain: string): Promise<DnsData> {
  const types: DnsRecordType[] = ["A", "AAAA", "MX", "CNAME", "TXT", "NS"];
  const results = await Promise.all(types.map((t) => queryDnsType(domain, t)));
  return {
    domainName: domain.toLowerCase(),
    records: results.flat(),
  };
}
