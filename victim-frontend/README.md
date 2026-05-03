# victim-frontend (脆弱な被害者サイトの React フロントエンド)

[victim-backend](../victim-backend/) と組み合わせて使用する、擬似銀行のフロント。
ログイン → 残高表示 → 送金 → 履歴表示 を行う SPA。

## 画面

| 画面 | 内容 |
| --- | --- |
| ログイン | デモユーザー (alice / bob / mallory) でログイン |
| ダッシュボード | 残高表示・送金フォーム・送金履歴 |

## API 連携

- ベース URL は `http://localhost:8000`（環境変数 `VITE_API_BASE` で上書き可）
- すべての fetch に `credentials: 'include'` を付与し、Cookie ベースで認証を保持
- ⚠️ CSRF トークンはあえて付けていない（被害者バックエンドが `@csrf_exempt` なため）

## 起動方法（ローカル）

前提: [victim-backend](../victim-backend/) が `http://localhost:8000` で起動済み。

```bash
cd victim-frontend
npm install
npm run dev
# → http://localhost:3000
```

## Docker での起動

```bash
cd victim-frontend
docker build -t csrf-victim-frontend .
docker run --rm -p 3000:3000 csrf-victim-frontend
```

最終的にはルートの `docker-compose.yml` で victim-backend と一緒に起動する。

## ⚠️ 注意

このフロントエンドはあくまで「被害者サイトの正規ユーザー画面」。
攻撃者サイト (`attacker-frontend`) は別ディレクトリで作成予定。
