import { VICTIM_API_BASE, DEFAULT_TARGET } from "@/config.js";

/**
 * ② <img src> による GET CSRF
 *
 * 本サンプルの送金 API は POST 限定なので 405 が返り、
 * **失敗例として観察できる**。
 * 「GET で副作用を起こさない」設計原則の重要性を体感する罠。
 */
export default function ImageGetTrap() {
  const url = `${VICTIM_API_BASE}/api/transfer/?to=${DEFAULT_TARGET}&amount=1`;
  return (
    <>
      <pre>{`<img src="${url}">`}</pre>
      <p className="hint">
        DevTools の Network タブで <code>405 Method Not Allowed</code> を確認できればOK。
      </p>
      <img src={url} alt="(失敗するはずの罠リクエスト)" style={{ border: "1px dashed #f87171", padding: 8 }} />
    </>
  );
}
