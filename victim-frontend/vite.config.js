import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 開発時は victim-backend (http://localhost:8000) に直接 fetch する。
// CORS 側で `CORS_ALLOW_ALL_ORIGINS=True` + `CORS_ALLOW_CREDENTIALS=True` に
// なっているため、credentials: 'include' で問題なく Cookie を送受できる。
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});
