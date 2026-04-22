import { motion } from "framer-motion";
import type { ScoreBreakdown } from "@/lib/computeScore";

const EASE = [0.25, 0.1, 0.25, 1] as const;

interface Props {
  breakdown: ScoreBreakdown;
}

export default function ScoreSummaryCard({ breakdown }: Props) {
  const { total, headers, ssl, vt, passCount, warnCount, failCount } =
    breakdown;

  const passed = total >= 80;

  /** Arc progress bar — semicircle style */
  const RADIUS = 52;
  const circumference = 2 * Math.PI * RADIUS;
  // Hanya gunakan setengah lingkaran (180°) untuk tampilan gauge
  const halfCirc = circumference / 2;
  const offset = halfCirc - (halfCirc * total) / 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="bg-card shadow-card-md rounded-xl p-6 border border-border/50"
    >
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
        Overall Risk Score
      </h3>

      {/* Score gauge */}
      <div className="flex flex-col items-center mb-5">
        <div className="relative flex items-center justify-center w-36 h-20 overflow-hidden">
          {/* Background semicircle */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 128 72"
            fill="none"
          >
            {/* Track */}
            <path
              d="M 12 68 A 52 52 0 0 1 116 68"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              className="text-muted"
            />
            {/* Fill — animates with strokeDashoffset */}
            <path
              d="M 12 68 A 52 52 0 0 1 116 68"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${halfCirc}`}
              strokeDashoffset={`${offset}`}
              className={passed ? "text-success" : "text-destructive"}
              style={{
                transition:
                  "stroke-dashoffset 1s cubic-bezier(0.25, 0.1, 0.25, 1)",
              }}
            />
          </svg>
          {/* Score label */}
          <div className="relative mt-8 flex flex-col items-center leading-none">
            <span
              className={`text-4xl font-black tabular-nums ${passed ? "text-success" : "text-destructive"}`}
            >
              {total}
            </span>
            <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-widest">
              / 100
            </span>
          </div>
        </div>

        <div
          className={`mt-2 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest text-white ${passed ? "bg-success" : "bg-destructive"}`}
        >
          {passed ? "Passed" : "Failed"}
        </div>
      </div>

      {/* Pass / Warn / Fail counters */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-green-50 border border-green-100 rounded-lg p-2.5 text-center">
          <p className="text-xl font-bold text-success tabular-nums">
            {passCount}
          </p>
          <p className="text-[10px] font-bold uppercase text-green-600 mt-0.5">
            Passed
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5 text-center">
          <p className="text-xl font-bold text-warning tabular-nums">
            {warnCount}
          </p>
          <p className="text-[10px] font-bold uppercase text-amber-600 mt-0.5">
            Warning
          </p>
        </div>
        <div className="bg-red-50 border border-red-100 rounded-lg p-2.5 text-center">
          <p className="text-xl font-bold text-destructive tabular-nums">
            {failCount}
          </p>
          <p className="text-[10px] font-bold uppercase text-red-600 mt-0.5">
            Failed
          </p>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="space-y-2 border-t border-border/40 pt-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
          Score Breakdown
        </p>

        <ScoreBar
          label="HTTP Headers"
          score={headers}
          max={40}
          colorClass="bg-blue-500"
        />
        <ScoreBar
          label="SSL / TLS"
          score={ssl}
          max={40}
          colorClass="bg-violet-500"
        />
        <ScoreBar
          label="VirusTotal"
          score={vt}
          max={20}
          colorClass="bg-emerald-500"
          pending={vt === 10 /* neutral = data belum masuk */}
        />
      </div>
    </motion.div>
  );
}

// ─── Score bar sub-component ──────────────────────────────────────────────────

function ScoreBar({
  label,
  score,
  max,
  colorClass,
  pending = false,
}: {
  label: string;
  score: number;
  max: number;
  colorClass: string;
  pending?: boolean;
}) {
  const pct = Math.min(100, (score / max) * 100);
  const displayScore = Math.round(score);

  return (
    <div>
      <div className="flex items-center justify-between text-[11px] mb-1">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="tabular-nums font-semibold text-foreground">
          {displayScore}
          <span className="text-muted-foreground font-normal">/{max}</span>
          {pending && (
            <span className="ml-1 text-[9px] text-amber-500 font-bold uppercase">
              pending
            </span>
          )}
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colorClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        />
      </div>
    </div>
  );
}
