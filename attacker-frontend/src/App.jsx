import { useState } from "react";
import { VICTIM_FRONTEND_BASE, VICTIM_API_BASE } from "./config.js";
import AutoFormTrap from "./traps/AutoFormTrap.jsx";
import ImageGetTrap from "./traps/ImageGetTrap.jsx";
import FetchTrap from "./traps/FetchTrap.jsx";
import IframeTrap from "./traps/IframeTrap.jsx";

const TRAPS = [
  {
    id: "auto-form",
    title: "① <form> 自動 submit",
    desc: "マウント時に隠し form を submit する古典的 CSRF。",
    Component: AutoFormTrap,
  },
  {
    id: "image-get",
    title: "② <img src> による GET CSRF",
    desc: "送金 API が GET でも処理してしまう実装を狙う。本サンプルでは 405 で失敗する観察用。",
    Component: ImageGetTrap,
  },
  {
    id: "fetch",
    title: "③ fetch() + credentials:'include'",
    desc: "JSON を JS から POST。CORS 設定が緩いと成立する。",
    Component: FetchTrap,
  },
  {
    id: "iframe",
    title: "④ 不可視 iframe",
    desc: "罠①ページ (attacker-backend が配信) を iframe で複数回ロード。",
    Component: IframeTrap,
  },
];

export default function App() {
  const [activeId, setActiveId] = useState(null);
  const active = TRAPS.find((t) => t.id === activeId);

  return (
    <div className="container">
      <header>
        <h1>
          😈 Evil SPA <small>(attacker-frontend)</small>
        </h1>
        <p className="warn">
          ⚠️ これは CSRF 攻撃の学習用罠サイトです。被害者サイト{" "}
          <a href={VICTIM_FRONTEND_BASE} target="_blank" rel="noreferrer">
            {VICTIM_FRONTEND_BASE}
          </a>{" "}
          に <code>alice / alicepass</code> でログイン中のブラウザで開いてください。
        </p>
        <p className="hint">
          victim-backend: <code>{VICTIM_API_BASE}</code>
        </p>
      </header>

      <nav className="nav">
        <button className={!activeId ? "active" : ""} onClick={() => setActiveId(null)}>
          一覧
        </button>
        {TRAPS.map((t) => (
          <button key={t.id} className={activeId === t.id ? "active" : ""} onClick={() => setActiveId(t.id)}>
            {t.title}
          </button>
        ))}
      </nav>

      {active ? (
        <div className="card">
          <h2>{active.title}</h2>
          <p className="desc">{active.desc}</p>
          <active.Component />
        </div>
      ) : (
        <ul className="list">
          {TRAPS.map((t) => (
            <li key={t.id} className="card">
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
              <button onClick={() => setActiveId(t.id)}>開く</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
