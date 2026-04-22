import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Search, Loader2, AlertCircle } from "lucide-react";
import type { LastAnalysisStats } from "@/types/virustotal";
import type { VtScoreInput } from "@/lib/computeScore";

// ─── Env config — same pattern as IndexDomainScanner.tsx ──────────────────────
const VT_BASE = import.meta.env.VITE_VT_PROXY_BASE as string;
const VT_PROXY_KEY = import.meta.env.VITE_VT_PROXY_BASE_KEY as string;

// ─── Types ─────────────────────────────────────────────────────────────────────
interface VTDomainResult {
  malicious: number;
  suspicious: number;
  harmless: number;
  undetected: number;
  reputation: number;
  categories: string[];
  vtId: string;
}

async function fetchVTDomain(domain: string): Promise<VTDomainResult> {
  const endpoint = `${VT_BASE}/domains/${domain}`;

  const headers: Record<string, string> = {};
  if (VT_PROXY_KEY) {
    headers["Authorization"] = `Bearer ${VT_PROXY_KEY}`;
  }

  const res = await fetch(endpoint, { headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg =
      (err as { error?: { message?: string } })?.error?.message ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json: any = await res.json();
  const attrs = json?.data?.attributes ?? {};
  const stats: LastAnalysisStats = attrs.last_analysis_stats ?? {};
  const rawCategories: Record<string, string> = attrs.categories ?? {};

  return {
    malicious: stats.malicious ?? 0,
    suspicious: stats.suspicious ?? 0,
    harmless: stats.harmless ?? 0,
    undetected: stats.undetected ?? 0,
    reputation: attrs.reputation ?? 0,
    categories: Object.values(rawCategories).slice(0, 3),
    vtId: json?.data?.id ?? domain,
  };
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const EASE = [0.25, 0.1, 0.25, 1] as const;

// ─── Props ─────────────────────────────────────────────────────────────────────
interface VirusTotalCardProps {
  /** Hostname / domain yang sedang di-scan, misal: "example.com" */
  domain: string;
  /**
   * Dipanggil saat data VT berhasil di-fetch (atau saat error/loading-ulang).
   * Parent menggunakan ini untuk menghitung score gabungan.
   * Kirim `null` saat fetch gagal / sedang loading ulang.
   */
  onResult?: (result: VtScoreInput | null) => void;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function VirusTotalCard({ domain, onResult }: VirusTotalCardProps) {
  const [data, setData] = useState<VTDomainResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!domain) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);
    // Reset parent score saat mulai fetch ulang
    onResult?.(null);

    fetchVTDomain(domain)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          onResult?.({
            malicious: result.malicious,
            suspicious: result.suspicious,
          });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
          // Error = kirim null (neutral scoring)
          onResult?.(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [domain]); // eslint-disable-line react-hooks/exhaustive-deps

  // Derived values
  const reputation = data?.reputation ?? 0;
  const circumference = 2 * Math.PI * 52;
  // Clamp reputation to [0, 100] for display — VT reputation can be negative
  const clampedRep = Math.min(100, Math.max(0, reputation));
  const offset = circumference - (circumference * clampedRep) / 100;

  const repColor =
    reputation < 0
      ? "text-red-500"
      : reputation >= 70
        ? "text-emerald-500"
        : reputation >= 30
          ? "text-amber-500"
          : "text-red-400";

  const vtUrl = data?.vtId
    ? `https://www.virustotal.com/gui/domain/${data.vtId}`
    : "https://www.virustotal.com";

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
      className="bg-zinc-900 text-zinc-100 shadow-card-md rounded-xl p-6 overflow-hidden relative"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(255,255,255,1) 24px, rgba(255,255,255,1) 25px), repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(255,255,255,1) 24px, rgba(255,255,255,1) 25px)",
        }}
      />

      <div className="relative z-10 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm flex items-center gap-2 text-zinc-100">
            <Search size={16} className="text-blue-400" />
            VirusTotal Analysis
          </h2>
          <a
            href={vtUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            View full report
            <ExternalLink size={11} />
          </a>
        </div>

        {/* ── Loading state ── */}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 size={28} className="text-blue-400 animate-spin" />
            <p className="text-xs text-zinc-400">Querying VirusTotal…</p>
          </div>
        )}

        {/* ── Error state ── */}
        {!loading && error && (
          <div className="flex items-start gap-2 bg-red-950/40 border border-red-800/50 rounded-lg px-3 py-2.5">
            <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-red-400">
                VirusTotal unavailable
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* ── Empty / no domain ── */}
        {!loading && !error && !data && (
          <div className="flex flex-col items-center gap-2 py-6">
            <Search size={22} className="text-zinc-600" />
            <p className="text-xs text-zinc-500">
              Scan a domain to see VirusTotal data.
            </p>
          </div>
        )}

        {/* ── Result state ── */}
        {!loading && !error && data && (
          <>
            {/* Reputation gauge */}
            <div className="flex items-center justify-center py-2">
              <div className="relative flex items-center justify-center">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 128 128">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-zinc-800"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={repColor}
                    style={{
                      transition:
                        "stroke-dashoffset 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
                  <span
                    className={`text-3xl font-bold tabular-nums leading-none ${repColor}`}
                  >
                    {reputation}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
                    Reputation
                  </span>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-zinc-800/60 p-3 rounded-lg border border-zinc-700/40">
                <p className="text-[9px] uppercase text-zinc-500 font-bold mb-1">
                  Malicious
                </p>
                <p
                  className={`text-xl font-bold tabular-nums ${data.malicious > 0 ? "text-red-400" : "text-zinc-300"}`}
                >
                  {data.malicious}
                </p>
              </div>
              <div className="bg-zinc-800/60 p-3 rounded-lg border border-zinc-700/40">
                <p className="text-[9px] uppercase text-zinc-500 font-bold mb-1">
                  Suspicious
                </p>
                <p
                  className={`text-xl font-bold tabular-nums ${data.suspicious > 0 ? "text-amber-400" : "text-zinc-300"}`}
                >
                  {data.suspicious}
                </p>
              </div>
              <div className="bg-zinc-800/60 p-3 rounded-lg border border-zinc-700/40">
                <p className="text-[9px] uppercase text-zinc-500 font-bold mb-1">
                  Harmless
                </p>
                <p className="text-xl font-bold tabular-nums text-emerald-400">
                  {data.harmless}
                </p>
              </div>
              <div className="bg-zinc-800/60 p-3 rounded-lg border border-zinc-700/40">
                <p className="text-[9px] uppercase text-zinc-500 font-bold mb-1">
                  Undetected
                </p>
                <p className="text-xl font-bold tabular-nums text-zinc-400">
                  {data.undetected}
                </p>
              </div>
            </div>

            {/* Categories */}
            {data.categories.length > 0 && (
              <div className="pt-1 border-t border-zinc-800">
                <p className="text-[11px] text-zinc-500">
                  Categories:{" "}
                  <span className="text-zinc-300">
                    {data.categories.join(", ")}
                  </span>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </motion.section>
  );
}
