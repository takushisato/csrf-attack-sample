// victim-backend のベースURL。Docker から参照する場合などは
// VITE_API_BASE 環境変数で上書きできるようにしておく。
const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    // ⚠️ 学習用: credentials: 'include' でクロスオリジンでも Cookie を送る。
    // 本来 CSRF 対策としては、このフロント側で CSRF トークンを取り出して
    // X-CSRFToken ヘッダに付ける必要があるが、被害者バックエンドは
    // @csrf_exempt なので何もしなくても通ってしまう。
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const err = new Error(data.detail || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  me: () => request("/api/me/"),
  login: (username, password) => request("/api/login/", { method: "POST", body: { username, password } }),
  logout: () => request("/api/logout/", { method: "POST" }),
  transfer: (to, amount) => request("/api/transfer/", { method: "POST", body: { to, amount } }),
  history: () => request("/api/transfers/"),
};
