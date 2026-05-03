# attacker-backend (攻撃者サイトのバックエンド)

CSRF 攻撃の罠ページを配信するための Django プロジェクト。
被害者サイト (`victim-backend` + `victim-frontend`) と **別オリジン** で動かすことが重要。

| サービス | デフォルト URL |
| --- | --- |
| victim-backend  | http://localhost:8000 |
| victim-frontend | http://localhost:3000 |
| **attacker-backend** | **http://localhost:9000** |
| attacker-frontend | http://localhost:4000 (今後作成) |

## 提供する罠ページ

| URL | 攻撃手口 |
| --- | --- |
| `/` | 罠ページの一覧 |
| `/trap/auto-form/` | 隠し `<form>` を自動 submit する古典的 CSRF |
| `/trap/image-get/` | `<img src>` による GET CSRF（本サンプルでは失敗例） |
| `/trap/fetch/` | `fetch()` + `credentials:'include'` による JSON POST |
| `/trap/iframe/` | 不可視 iframe で罠①を繰り返し実行 |

各テンプレートには「なぜ攻撃が成立するか」のコメントを併記してある。

## ローカル起動（venv）

```bash
cd attacker-backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py runserver 0.0.0.0:9000
# → http://localhost:9000
```

DB は使わないので `migrate` 不要。

## Docker での起動

```bash
cd attacker-backend
docker build -t csrf-attacker-backend .
docker run --rm -p 9000:9000 csrf-attacker-backend
```

被害者バックエンドの URL を変える場合:

```bash
docker run --rm -p 9000:9000 \
  -e VICTIM_API_BASE=http://host.docker.internal:8000 \
  csrf-attacker-backend
```

## 試し方

1. victim-backend と victim-frontend を起動する
2. ブラウザで `http://localhost:3000` を開いて `alice / alicepass` でログイン
3. 同じブラウザの別タブで `http://localhost:9000/trap/auto-form/` を開く
4. victim-frontend のタブをリロードし、残高が減っていることを確認

> ⚠️ Chrome 系では `SameSite=None; Secure=false` の Cookie が保存されないため、
> Firefox の使用、または `host.docker.internal` 等で同一 eTLD+1 にする工夫が必要。
> 詳しくは [victim-backend/README.md](../victim-backend/README.md) を参照。
