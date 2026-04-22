import { useRouteError, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function RouteError() {
  const error = useRouteError() as any;
  const navigate = useNavigate();
  console.error(error);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center p-6 sm:p-12 overflow-hidden min-h-full">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-destructive/10 rounded-full blur-[100px] animate-pulse-soft" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[100px] animate-pulse-soft" />
        <div className="absolute inset-0 bg-grid opacity-[0.03] dark:opacity-[0.05]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10 flex flex-col items-center text-center max-w-2xl w-full"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-destructive/20 blur-2xl rounded-full scale-110" />
          <div className="relative bg-card border border-border/50 p-6 rounded-3xl shadow-shadow-drop backdrop-blur-sm">
            <AlertTriangle className="w-16 h-16 text-destructive" strokeWidth={1.5} />
            <motion.div
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1"
            >
              <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center">
                <span className="w-3 h-3 bg-orange-500 rounded-full" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Error Text */}
        <div className="relative">
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-7xl sm:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground/80 to-foreground/40"
          >
            Oops!
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.7, duration: 1 }}
            className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-transparent via-destructive to-transparent opacity-50"
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 space-y-4 w-full"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Terjadi Kesalahan
          </h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
            Maaf, ada sesuatu yang salah saat memuat komponen pada halaman ini.
          </p>

          <div className="mt-6 bg-muted/50 border border-border/50 p-4 rounded-xl max-w-lg mx-auto w-full text-left backdrop-blur-sm shadow-inner overflow-x-auto">
            <code className="text-sm font-mono text-destructive/80 break-words whitespace-pre-wrap">
              {error?.statusText || error?.message || "Unknown error occurred"}
            </code>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto"
        >
          <Button
            variant="default"
            size="lg"
            onClick={() => window.location.reload()}
            className="group relative overflow-hidden px-8 py-6 rounded-2xl shadow-lg shadow-destructive/20 hover:shadow-destructive/30 transition-all active:scale-95 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            <RefreshCw className="mr-2 w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span>Muat Ulang</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="group px-8 py-6 rounded-2xl border-border/60 hover:bg-muted/50 hover:text-muted-foreground active:scale-95 transition-all"
          >
            <Link to="/">
              <Home className="mr-2 w-5 h-5" />
              <span>Kembali Beranda</span>
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
