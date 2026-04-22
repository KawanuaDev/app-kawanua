import { OwaspItem } from "@/types/securityscan";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Code2,
  ExternalLink,
  Link2,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "./CodeBlock";
import { OWASP_DATA } from "./data";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function OwaspSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
      className="bg-card shadow-card-md rounded-xl overflow-hidden border border-border/50"
    >
      <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary" />
          OWASP Top 10 Compliance
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-1 bg-muted rounded text-muted-foreground uppercase tracking-wider">
            2021 Standard
          </span>
          <span className="text-[10px] text-muted-foreground/60 italic hidden sm:block">
            Click any row to expand details
          </span>
        </div>
      </div>

      <div>
        {OWASP_DATA.map((item, i) => (
          <OwaspAccordionRow key={item.id} item={item} index={i} />
        ))}
      </div>
    </motion.section>
  );
}

const SEVERITY_CLASSES: Record<OwaspItem["severity"], string> = {
  Critical: "bg-red-50 text-red-700 border-red-100",
  High: "bg-orange-50 text-orange-700 border-orange-100",
  Medium: "bg-amber-50 text-amber-700 border-amber-100",
  Low: "bg-blue-50 text-blue-700 border-blue-100",
};

function StatusIcon({ status }: { status: OwaspItem["status"] }) {
  if (status === "pass")
    return <CheckCircle2 size={18} className="text-success mt-0.5 shrink-0" />;
  if (status === "warning")
    return <AlertTriangle size={18} className="text-warning mt-0.5 shrink-0" />;
  return <ShieldAlert size={18} className="text-destructive mt-0.5 shrink-0" />;
}

function SeverityBadge({ level }: { level: OwaspItem["severity"] }) {
  return (
    <span
      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border leading-none ${SEVERITY_CLASSES[level]}`}
    >
      {level}
    </span>
  );
}

function OwaspAccordionRow({
  item,
  index,
}: {
  item: OwaspItem;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const { detail } = item;

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.04, ease: EASE }}
      className="border-b border-border/40 last:border-0"
    >
      {/* Header row — clickable */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full px-6 py-4 hover:bg-muted/30 transition-colors duration-150 flex items-start gap-4 text-left group"
        aria-expanded={open}
      >
        <StatusIcon status={item.status} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-[11px] font-mono font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              {item.id}
            </span>
            <h3 className="font-medium text-sm text-foreground">
              {item.category}
            </h3>
            <SeverityBadge level={item.severity} />
            {item.status === "fail" && (
              <span className="text-[10px] font-bold text-destructive bg-red-50 border border-red-100 px-1.5 py-0.5 rounded uppercase">
                Action Required
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {item.description}
          </p>
          {item.cwe && (
            <p className="text-[11px] text-muted-foreground/60 mt-1 font-mono">
              {item.cwe}
            </p>
          )}
        </div>
        <div className="shrink-0 mt-0.5 ml-2">
          <ChevronDown
            size={15}
            className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Expandable detail panel */}
      <AnimatePresence initial={false}>
        {open && detail && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 pt-1 space-y-4 bg-muted/20 border-t border-border/30">
              {/* CVE Links */}
              {detail.cves.length > 0 && (
                <div>
                  <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    <ShieldAlert size={11} />
                    Known CVEs
                  </p>
                  <div className="space-y-1.5">
                    {detail.cves.map((cve) => (
                      <a
                        key={cve.id}
                        href={cve.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 group/cve"
                      >
                        <span className="font-mono text-xs font-semibold text-destructive bg-red-50 border border-red-100 px-1.5 py-0.5 rounded shrink-0 group-hover/cve:underline">
                          {cve.id}
                        </span>
                        <span className="text-xs text-muted-foreground leading-relaxed group-hover/cve:text-foreground transition-colors">
                          {cve.description}
                        </span>
                        <ExternalLink
                          size={10}
                          className="shrink-0 mt-0.5 text-muted-foreground/40 group-hover/cve:text-muted-foreground"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Remediation Code */}
              <div>
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  <Code2 size={11} />
                  Remediation Example
                </p>
                <CodeBlock
                  code={detail.remediationCode.code}
                  lang={detail.remediationCode.lang}
                />
              </div>

              {/* References */}
              <div>
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  <BookOpen size={11} />
                  References
                </p>
                <div className="flex flex-wrap gap-2">
                  {detail.references.map((ref) => (
                    <a
                      key={ref.url}
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] text-primary border border-primary/20 bg-primary/5 px-2.5 py-1 rounded-full hover:bg-primary/10 transition-colors"
                    >
                      <Link2 size={10} />
                      {ref.label}
                      <ExternalLink size={9} className="opacity-50" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
