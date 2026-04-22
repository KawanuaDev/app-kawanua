import { RecommendationItem } from "@/types/securityscan";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const RECOMMENDATIONS: RecommendationItem[] = [
  {
    title: "Enforce HTTPS & Disable TLS 1.0/1.1",
    description:
      "Redirect all HTTP traffic to HTTPS, implement HSTS with preloading, and disable deprecated TLS versions. Configure: Strict-Transport-Security: max-age=63072000; includeSubDomains; preload.",
    impact: "Critical",
    effort: "Low",
    reference: "A02:2021",
  },
  {
    title: "Implement Centralized Security Logging",
    description:
      "Deploy a SIEM solution or structured logging pipeline. Ensure all authentication events, access control failures, and input validation errors are captured with sufficient context for forensic analysis.",
    impact: "High",
    effort: "Medium",
    reference: "A09:2021",
  },
  {
    title: "Patch Vulnerable Dependencies",
    description:
      "Update lodash to ≥4.17.21, migrate from moment.js to date-fns, and upgrade axios to ≥0.21.4. Run npm audit fix after each update and validate test suite integrity.",
    impact: "High",
    effort: "Medium",
    reference: "A06:2021",
  },
  {
    title: "Harden Session Management",
    description:
      "Reduce session timeout to 60 minutes for standard users, 15 minutes for admin roles. Enforce Secure, HttpOnly, and SameSite=Strict flags on all authentication cookies.",
    impact: "Medium",
    effort: "Low",
    reference: "A07:2021",
  },
];

const EASE = [0.25, 0.1, 0.25, 1] as const;

const IMPACT_TEXT_CLASSES: Record<RecommendationItem["impact"], string> = {
  Critical: "text-destructive",
  High: "text-orange-600",
  Medium: "text-warning",
  Low: "text-primary",
};

const IMPACT_DOT_CLASSES: Record<RecommendationItem["impact"], string> = {
  Critical: "bg-destructive",
  High: "bg-orange-500",
  Medium: "bg-warning",
  Low: "bg-primary",
};

const EFFORT_CLASSES: Record<RecommendationItem["effort"], string> = {
  High: "text-muted-foreground",
  Medium: "text-muted-foreground",
  Low: "text-success",
};

export default function RecommendationsSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Zap size={16} className="text-warning" />
        <h2 className="font-semibold text-sm text-foreground">
          Priority Recommendations
        </h2>
        <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded uppercase">
          {RECOMMENDATIONS.length} Actions
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {RECOMMENDATIONS.map((rec, i) => (
          <motion.div
            key={rec.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 * i, ease: EASE }}
            whileHover={{ y: -2 }}
            className="bg-card p-5 rounded-xl border border-border/50 shadow-card-sm flex flex-col md:flex-row gap-4 group cursor-default"
          >
            <div className="flex-1 space-y-1.5 min-w-0">
              <div className="flex items-start gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${IMPACT_DOT_CLASSES[rec.impact]}`}
                />
                <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-150">
                  {rec.title}
                </h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed pl-3.5">
                {rec.description}
              </p>
              <p className="text-[11px] font-mono text-muted-foreground/50 pl-3.5">
                Ref: {rec.reference}
              </p>
            </div>
            <div className="flex md:flex-col justify-start md:justify-center gap-4 md:gap-3 md:pl-5 md:border-l border-border/50 min-w-[110px] shrink-0">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground font-bold mb-0.5">
                  Impact
                </p>
                <p
                  className={`text-xs font-bold ${IMPACT_TEXT_CLASSES[rec.impact]}`}
                >
                  {rec.impact}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground font-bold mb-0.5">
                  Effort
                </p>
                <p
                  className={`text-xs font-semibold ${EFFORT_CLASSES[rec.effort]}`}
                >
                  {rec.effort}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
