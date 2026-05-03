"""
⚠️ ここに含まれるエンドポイントは CSRF 攻撃の標的として **意図的に脆弱** に
書かれている。各アンチパターンはコメントで解説する。
"""

import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db import transaction
from django.http import HttpRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Account, TransferLog


def _json_body(request: HttpRequest) -> dict:
    if not request.body:
        return {}
    try:
        return json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return {}


@csrf_exempt
@require_http_methods(["POST"])
def login_view(request: HttpRequest) -> JsonResponse:
    """ログイン（学習用に CSRF 無効）。"""
    data = _json_body(request)
    username = data.get("username") or request.POST.get("username")
    password = data.get("password") or request.POST.get("password")
    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse({"detail": "認証に失敗しました"}, status=401)
    login(request, user)
    Account.objects.get_or_create(user=user)
    return JsonResponse({"detail": "ログイン成功", "username": user.username})


@csrf_exempt
@require_http_methods(["POST"])
def logout_view(request: HttpRequest) -> JsonResponse:
    logout(request)
    return JsonResponse({"detail": "ログアウト"})


@require_http_methods(["GET"])
def me_view(request: HttpRequest) -> JsonResponse:
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "未ログイン"}, status=401)
    account, _ = Account.objects.get_or_create(user=request.user)
    return JsonResponse(
        {
            "username": request.user.username,
            "balance": account.balance,
        }
    )


# ----------------------------------------------------------------------
# ⚠️ アンチパターンの中核: 送金エンドポイント
# ----------------------------------------------------------------------
# 1. @csrf_exempt によって CSRF トークン検証を無効化している。
# 2. POST のみだが、Content-Type を application/x-www-form-urlencoded に
#    すれば <form> による単純 POST が可能なので、ブラウザのプリフライトを
#    起こさずに攻撃者サイトから送信できる（CORS 単純リクエスト）。
# 3. 認証はセッション Cookie のみに依存しており、Origin / Referer の
#    検証も行っていない。
# 結果として、被害者がログイン中に攻撃者サイトを開くだけで送金が成立する。
# ----------------------------------------------------------------------
@csrf_exempt
@require_http_methods(["POST"])
def transfer_view(request: HttpRequest) -> JsonResponse:
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "未ログイン"}, status=401)

    data = _json_body(request) or request.POST
    to_username = data.get("to")
    try:
        amount = int(data.get("amount", 0))
    except (TypeError, ValueError):
        return JsonResponse({"detail": "amount が不正"}, status=400)

    if not to_username or amount <= 0:
        return JsonResponse({"detail": "パラメータが不正"}, status=400)

    if to_username == request.user.username:
        return JsonResponse({"detail": "自分宛には送金できません"}, status=400)

    try:
        to_user = User.objects.get(username=to_username)
    except User.DoesNotExist:
        return JsonResponse({"detail": "送金先が存在しません"}, status=404)

    with transaction.atomic():
        from_account = Account.objects.select_for_update().get(user=request.user)
        to_account, _ = Account.objects.select_for_update().get_or_create(user=to_user)

        if from_account.balance < amount:
            return JsonResponse({"detail": "残高不足"}, status=400)

        from_account.balance -= amount
        to_account.balance += amount
        from_account.save()
        to_account.save()

        TransferLog.objects.create(
            from_user=request.user,
            to_username=to_username,
            amount=amount,
        )

    return JsonResponse(
        {
            "detail": "送金完了",
            "from": request.user.username,
            "to": to_username,
            "amount": amount,
            "balance": from_account.balance,
        }
    )


@require_http_methods(["GET"])
def transfer_history_view(request: HttpRequest) -> JsonResponse:
    if not request.user.is_authenticated:
        return JsonResponse({"detail": "未ログイン"}, status=401)
    logs = TransferLog.objects.filter(from_user=request.user)[:50]
    return JsonResponse(
        {
            "items": [
                {
                    "to": log.to_username,
                    "amount": log.amount,
                    "created_at": log.created_at.isoformat(),
                }
                for log in logs
            ]
        }
    )
