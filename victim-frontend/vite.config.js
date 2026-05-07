import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// 開発時は victim-backend (http://localhost:8000) に直接 fetch する。
// CORS 側で `CORS_ALLOW_ALL_ORIGINS=True` + `CORS_ALLOW_CREDENTIALS=True` に
// なっているため、credentials: 'include' で問題なく Cookie を送受できる。
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
    port: 3000,
  },
});
