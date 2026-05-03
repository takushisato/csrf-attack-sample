# victim-backend (脆弱な被害者サイト Django バックエンド)

擬似的な「銀行」アプリ。ログインしているユーザーが他ユーザーへ送金できる。
**意図的に CSRF 脆弱性を残してある**ため、攻撃者サイト (`attacker-frontend`) を
開いただけで送金 API が叩かれてしまう、という挙動を体験できる。

## 主なアンチパターン

| # | 場所 | 内容 |
| - | --- | --- |
| 1 | [`bank/views.py`](bank/views.py) | 状態を変える `POST /api/transfer/` に `@csrf_exempt` を付けて CSRF トークンを検証していない |
| 2 | [`config/settings.py`](config/settings.py) | `SESSION_COOKIE_SAMESITE = "None"` でクロスサイトでも Cookie が送られる |
| 3 | [`config/settings.py`](config/settings.py) | `CORS_ALLOW_ALL_ORIGINS=True` + `CORS_ALLOW_CREDENTIALS=True` で任意オリジンから Cookie 付き fetch を受け入れる |
| 4 | [`bank/views.py`](bank/views.py) | `Origin` / `Referer` ヘッダの検証を行っていない |

## エンドポイント

| メソッド | パス | 説明 |
| --- | --- | --- |
| POST | `/api/login/` | `{"username","password"}` でログイン |
| POST | `/api/logout/` | ログアウト |
| GET  | `/api/me/` | 自分のユーザー名と残高 |
| POST | `/api/transfer/` | `{"to","amount"}` で送金（**脆弱**） |
| GET  | `/api/transfers/` | 自分の送金履歴 |

## デモユーザー

`python manage.py seed_demo` で投入される。

| username | password | 初期残高 |
| --- | --- | --- |
| alice | alicepass | 100,000 |
| bob | bobpass | 50,000 |
| mallory | mallorypass | 0 |

`alice` を被害者、`mallory` を攻撃者の受け取り口座と想定。

## ローカル起動（Docker を使わない場合）

```bash
cd victim-backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo
python manage.py runserver 0.0.0.0:8000
```

## Docker での起動

```bash
cd victim-backend
docker build -t csrf-victim-backend .
docker run --rm -p 8000:8000 csrf-victim-backend
```

最終的にはリポジトリルートの `docker-compose.yml` から他サービスと一緒に起動する想定。

## 動作確認 (curl)

```bash
# ログイン
curl -i -c cookies.txt -H 'Content-Type: application/json' \
  -d '{"username":"alice","password":"alicepass"}' \
  http://localhost:8000/api/login/

# 自分の情報
curl -b cookies.txt http://localhost:8000/api/me/

# 送金（CSRF トークンなしで通ってしまう = 脆弱）
curl -i -b cookies.txt -H 'Content-Type: application/json' \
  -d '{"to":"mallory","amount":1000}' \
  http://localhost:8000/api/transfer/
```

## ⚠️ ブラウザ実機で攻撃を再現する際の注意

`SameSite=None; Secure=false` の Cookie は Chrome 系では保存されない。
ローカルで体験するときは Firefox を使うか、`/etc/hosts` で同一 eTLD+1 の
サブドメインを切るなどの工夫が必要。
（このあたりは `attacker-frontend` を作るときに改めて整理する）
