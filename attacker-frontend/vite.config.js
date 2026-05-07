import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// 攻撃者サイト。victim-frontend (3000) / victim-backend (8000) と
// 別オリジンになるよう port 4000 で動かす。
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // `@/...` で src/ 以下を絶対パス風に import できるようにする。
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 4000,
  },
});
