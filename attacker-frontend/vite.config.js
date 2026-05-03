import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 攻撃者サイト。victim-frontend (3000) / victim-backend (8000) と
// 別オリジンになるよう port 4000 で動かす。
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 4000,
  },
});
