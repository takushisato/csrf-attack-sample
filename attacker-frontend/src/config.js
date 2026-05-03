// 被害者バックエンド / フロントエンドの URL（環境変数で上書き可能）。
export const VICTIM_API_BASE = import.meta.env.VITE_VICTIM_API_BASE ?? "http://localhost:8000";
export const VICTIM_FRONTEND_BASE = import.meta.env.VITE_VICTIM_FRONTEND_BASE ?? "http://localhost:3000";

// 攻撃で送金する宛先と金額のデフォルト。
export const DEFAULT_TARGET = "mallory";
export const DEFAULT_AMOUNT = 1000;
