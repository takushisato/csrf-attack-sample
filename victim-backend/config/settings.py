"""
Django settings for the *vulnerable* victim backend.

⚠️ このファイルは CSRF アンチパターンを学習するために、意図的に脆弱な設定を
含んでいます。本番環境では絶対に使用しないでください。
"""

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# --- 基本設定 -------------------------------------------------------------

SECRET_KEY = "insecure-demo-secret-key-do-not-use-in-production"  # 学習用
DEBUG = True
ALLOWED_HOSTS = ["*"]  # 学習用にすべて許可

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "bank",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    # ⚠️ アンチパターン①:
    # 学習対象のエンドポイントは @csrf_exempt で個別に外しているが、
    # CsrfViewMiddleware 自体は有効のまま残してある。
    # （より露骨なアンチパターンとして、ここから外してしまうサンプルもある）
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# --- データベース ---------------------------------------------------------

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# --- 認証 ----------------------------------------------------------------

AUTH_PASSWORD_VALIDATORS: list[dict] = []

LANGUAGE_CODE = "ja"
TIME_ZONE = "Asia/Tokyo"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- ⚠️ CSRF アンチパターン: セッション/CORS 設定 ----------------------------
#
# 現代のブラウザでは Cookie のデフォルト SameSite が Lax のため、
# 「クロスオリジンの罠ページからの fetch/form POST」では Cookie が送られず
# CSRF が成立しないことが多い。
# 学習目的で **わざと** SameSite=None にし、攻撃者サイト (別オリジン) からの
# リクエストに対してもセッション Cookie が送出されるようにしている。
#
# ※ SameSite=None には Secure 属性が必須で、ローカル http 環境では Chrome 系
#    ブラウザに Cookie が保存されない。本サンプルでは victim-frontend
#    (localhost:3000) も attacker-frontend (localhost:4000) も同一 eTLD+1
#    である "localhost" 配下なので、SameSite=Lax のままでも別ポートからの
#    Cookie 送出は同一サイト扱いとなり、CSRF 攻撃の検証は成立する。
SESSION_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SECURE = False
SESSION_COOKIE_HTTPONLY = True  # XSS は本サンプルの対象外

# CSRF Cookie も同様にゆるく
CSRF_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SECURE = False
CSRF_COOKIE_HTTPONLY = False

# ⚠️ アンチパターン②: CORS で credentials 付きリクエストを全許可
#  本来 Allow-Origin に "*" は credentials 付きでは使えないため、
#  django-cors-headers で「リクエストの Origin をそのまま反射」する設定にする。
#  これにより任意のオリジンから Cookie 付き fetch が可能になる典型的ミス構成。
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# CSRF の Trusted Origins（Django 4+ 必須）。
# 学習用にフロントエンド/攻撃者サイトの想定ポートを入れておく。
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",  # victim-frontend (予定)
    "http://localhost:4000",  # attacker-frontend (予定)
    "http://127.0.0.1:3000",
    "http://127.0.0.1:4000",
]
