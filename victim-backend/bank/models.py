from django.conf import settings
from django.db import models


class Account(models.Model):
    """
    学習用の擬似銀行口座

    - 1ユーザー1口座とする
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="account",
    )
    balance = models.IntegerField(default=10000)

    def __str__(self) -> str:
        return f"{self.user.username}: {self.balance}円"


class TransferLog(models.Model):
    """
    送金ログ

    - CSRF 攻撃の成立を可視化
    """

    from_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_transfers",
    )
    to_username = models.CharField(max_length=150)
    amount = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
