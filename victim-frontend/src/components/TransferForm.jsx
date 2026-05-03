import { useState } from "react";
import { api } from "../api.js";

export default function TransferForm({ onTransferred }) {
  const [to, setTo] = useState("mallory");
  const [amount, setAmount] = useState(1000);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const res = await api.transfer(to, Number(amount));
      setMessage(`${res.to} へ ${res.amount} 円を送金しました`);
      onTransferred();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card">
      <h2>送金</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          送金先ユーザー名
          <input value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        <label>
          金額 (円)
          <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <button type="submit" disabled={busy}>
          {busy ? "送金中..." : "送金する"}
        </button>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </section>
  );
}
