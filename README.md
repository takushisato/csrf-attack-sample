# csrf-attack-sample

CSRF（クロスサイトリクエストフォージェリ）攻撃を**意図的に成立させる**ことで、
アンチパターンと対策を体感的に学ぶための教材リポジトリです。

⚠️ **注意**: このリポジトリは脆弱なコードを含みます。学習目的に限定し、公開ネットワークやインターネット上にデプロイしないでください。

## 構成

| ディレクトリ | 役割 | スタック | URL |
| --- | --- | --- | --- |
| [`victim-backend/`](victim-backend/) | 被害者サイトのバックエンド (擬似銀行 API) | Django | http://localhost:8000 |
| [`victim-frontend/`](victim-frontend/) | 被害者サイトのフロントエンド | React (Vite) | http://localhost:3000 |
| [`attacker-backend/`](attacker-backend/) | 攻撃者サイトのバックエンド (罠ページ配信) | Django | http://localhost:9000 |
| [`attacker-frontend/`](attacker-frontend/) | 攻撃者サイトの SPA | React (Vite) | http://localhost:4000 |

## ステータス

- [x] `victim-backend/`
- [x] `victim-frontend/`
- [x] `attacker-backend/`
- [x] `attacker-frontend/`
- [x] ルート `docker-compose.yml`

## クイックスタート (Docker)

```bash
docker compose up --build
```

起動後、ブラウザで以下を順に開く:

1. **被害者サイト**: http://localhost:3000
   - `alice / alicepass` でログイン（残高 100,000 円）
2. **攻撃者サイト (Django テンプレート版)**: http://localhost:9000
   または **攻撃者サイト (React SPA 版)**: http://localhost:4000
   - 各罠ページを開くと、被害者の口座から `mallory` へ送金が走る
3. 被害者サイトのタブを再読み込みして残高が減っていることを確認

停止と初期化:

```bash
docker compose down       # コンテナだけ停止
docker compose down -v    # ボリュームも削除（学習リセット）
```

## 個別起動

各ディレクトリの README を参照:

- [victim-backend/README.md](victim-backend/README.md)
- [victim-frontend/README.md](victim-frontend/README.md)
- [attacker-backend/README.md](attacker-backend/README.md)
- [attacker-frontend/README.md](attacker-frontend/README.md)

## デモユーザー

| username | password | 役割 | 初期残高 |
| --- | --- | --- | --- |
| alice | alicepass | 被害者 | 100,000 |
| bob | bobpass | 第三者 | 50,000 |
| mallory | mallorypass | 攻撃者の受取口座 | 0 |

## ⚠️ ブラウザの注意

被害者バックエンドは学習目的でセッション Cookie を `SameSite=None; Secure=false`
で発行している。**Chrome 系ブラウザはこの組み合わせの Cookie を保存しない**
ため、攻撃が再現できない場合は **Firefox** を使うことを推奨する。

詳しい背景は [victim-backend/README.md](victim-backend/README.md) を参照。

## 学べる CSRF アンチパターン

| # | 場所 | アンチパターン |
| - | --- | --- |
| 1 | [victim-backend/bank/views.py](victim-backend/bank/views.py) | 状態を変える POST に `@csrf_exempt` を付けて CSRF トークンを検証していない |
| 2 | [victim-backend/config/settings.py](victim-backend/config/settings.py) | `SESSION_COOKIE_SAMESITE = "None"` でクロスサイトでも Cookie が送られる |
| 3 | [victim-backend/config/settings.py](victim-backend/config/settings.py) | `CORS_ALLOW_ALL_ORIGINS=True` + `CORS_ALLOW_CREDENTIALS=True` で任意オリジンから Cookie 付き fetch を受け入れる |
| 4 | [victim-backend/bank/views.py](victim-backend/bank/views.py) | `Origin` / `Referer` ヘッダの検証を行っていない |

攻撃手口側のサンプルは attacker-backend / attacker-frontend それぞれの
`traps/` 以下にコメント付きで揃えてある。
