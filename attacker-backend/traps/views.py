"""
攻撃者サイトの罠ページを配信するview

各ビューは「攻撃の手口」ごとに分かれており、それぞれ別の HTML を返す。
被害者ユーザーが victim-frontend にログイン中の状態で、これらのページを開くと、
ブラウザが victim-backend に Cookie 付きリクエストを送ってしまう。
"""

from django.conf import settings
from django.shortcuts import render


def _ctx(extra: dict | None = None) -> dict:
    base = {
        "victim_api_base": settings.VICTIM_API_BASE,
        "victim_frontend_base": "http://localhost:3000",
    }
    if extra:
        base.update(extra)
    return base


def index(request):
    """
    罠ページの一覧（インデックス）
    """
    traps = [
        {
            "title": "① <form> 自動 submit",
            "desc": "ページを開いた瞬間に隠し form を submit する古典的な手口。",
            "path": "/trap/auto-form/",
        },
        {
            "title": "② <img src=...> による GET CSRF",
            "desc": "GET で副作用が起きる API を狙うパターン（本サイトの送金 API は POST のみなので失敗例として観察）。",
            "path": "/trap/image-get/",
        },
        {
            "title": "③ fetch() + credentials:'include'",
            "desc": "JS から Cookie 付き fetch でクロスオリジン POST する。CORS 設定が緩いと成立。",
            "path": "/trap/fetch/",
        },
        {
            "title": "④ 不可視 iframe による継続攻撃",
            "desc": "iframe で罠ページを読み込み続け、何度でも送金させる。",
            "path": "/trap/iframe/",
        },
    ]
    return render(request, "traps/index.html", _ctx({"traps": traps}))


def auto_form(request):
    return render(request, "traps/auto_form.html", _ctx())


def image_get(request):
    return render(request, "traps/image_get.html", _ctx())


def fetch_attack(request):
    return render(request, "traps/fetch.html", _ctx())


def iframe_attack(request):
    return render(request, "traps/iframe.html", _ctx())
