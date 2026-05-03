"""
attacker-backend は「攻撃者が用意した罠サイト」を配信するための Django プロジェクト。

⚠️ 学習目的でのみ使用してください。
被害者 (victim-backend) と **必ず別オリジン** になるように動かす。
- victim-backend  : http://localhost:8000
- victim-frontend : http://localhost:3000
- attacker-backend: http://localhost:9000   ← これ
- attacker-frontend: http://localhost:4000
"""

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "insecure-attacker-demo-secret"
DEBUG = True
ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.staticfiles",
    "traps",
]

# 攻撃者サイト側はセッションも認証も不要なので、最小限のミドルウェア。
MIDDLEWARE = [
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

DATABASES: dict = {}  # DB は使わない

LANGUAGE_CODE = "ja"
TIME_ZONE = "Asia/Tokyo"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# テンプレートに埋め込む被害者サイトの URL（環境変数で上書き可能）。
import os as _os

VICTIM_API_BASE = _os.environ.get("VICTIM_API_BASE", "http://localhost:8000")
