import { useState } from "react";
import { api } from "../api.js";

export default function LoginForm({ onLoggedIn }) {
  const [username, setUsername] = useState("alice");
  const [password, setPassword] = useState("alicepass");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.login(username, password);
      onLoggedIn();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card">
      <h2>ログイン</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          ユーザー名
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        </label>
        <label>
          パスワード
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        <button type="submit" disabled={busy}>
          {busy ? "..." : "ログイン"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
      <p className="hint">
        デモユーザー: <code>alice / alicepass</code>, <code>bob / bobpass</code>, <code>mallory / mallorypass</code>
      </p>
    </section>
  );
}
