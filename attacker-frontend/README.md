# attacker-frontend (攻撃者サイトの React SPA)

[attacker-backend](../attacker-backend/) と同じ罠を、今度は React SPA として
実装したもの。「サーバーサイドテンプレートでも SPA でも、CSRF アンチパターンは
等しく成立する」ことを示すサンプル。

| サービス | デフォルト URL |
| --- | --- |
| victim-backend  | http://localhost:8000 |
| victim-frontend | http://localhost:3000 |
| attacker-backend | http://localhost:9000 |
| **attacker-frontend** | **http://localhost:4000** |

## 実装している罠

| ID | 手口 | コンポーネント |
| --- | --- | --- |
| ① | 隠し form の自動 submit | [`src/traps/AutoFormTrap.jsx`](src/traps/AutoFormTrap.jsx) |
| ② | `<img src>` による GET CSRF（失敗例） | [`src/traps/ImageGetTrap.jsx`](src/traps/ImageGetTrap.jsx) |
| ③ | `fetch()` + `credentials:'include'` | [`src/traps/FetchTrap.jsx`](src/traps/FetchTrap.jsx) |
| ④ | 不可視 iframe で罠①を 3 連射 | [`src/traps/IframeTrap.jsx`](src/traps/IframeTrap.jsx) |

## ローカル起動

```bash
cd attacker-frontend
npm install
npm run dev          # → http://localhost:4000
```

被害者バックエンド/フロントエンドの URL を変えたい場合は環境変数で:

```bash
VITE_VICTIM_API_BASE=http://localhost:8000 \
VITE_VICTIM_FRONTEND_BASE=http://localhost:3000 \
npm run dev
```

## Docker

```bash
cd attacker-frontend
docker build -t csrf-attacker-frontend .
docker run --rm -p 4000:4000 csrf-attacker-frontend
```

## 試し方

1. victim-backend (8000) と victim-frontend (3000) を起動
2. ブラウザで `http://localhost:3000` にて `alice / alicepass` でログイン
3. 同じブラウザで `http://localhost:4000` を開き、各罠ボタンを試す
4. victim-frontend のタブをリロードして残高の変化を確認

> ⚠️ Chrome 系では `SameSite=None; Secure=false` の Cookie が保存されないため、
> Firefox の使用を推奨。詳しくは
> [victim-backend/README.md](../victim-backend/README.md) を参照。
