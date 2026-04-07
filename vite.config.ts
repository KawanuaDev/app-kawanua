import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      // Proxy /api/vt/* → https://www.virustotal.com/api/v3/*
      // This bypasses CORS because the request is made server-side by Vite.
      "/api/vt": {
        target: "https://www.virustotal.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/vt/, "/api/v3"),
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
}));
