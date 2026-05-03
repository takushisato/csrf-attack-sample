"""学習用のデモユーザーと初期残高を投入する管理コマンド。

python manage.py seed_demo
"""

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from bank.models import Account

DEMO_USERS = [
    ("alice", "alicepass", 100000),  # 被害者
    ("mallory", "mallorypass", 0),  # 攻撃者（送金先）
    ("bob", "bobpass", 50000),
]


class Command(BaseCommand):
    help = "デモ用のユーザーと口座を作成する"

    def handle(self, *args, **options) -> None:
        for username, password, balance in DEMO_USERS:
            user, created = User.objects.get_or_create(username=username)
            if created:
                user.set_password(password)
                user.save()
            account, _ = Account.objects.get_or_create(user=user)
            account.balance = balance
            account.save()
            self.stdout.write(
                self.style.SUCCESS(
                    f"{'created' if created else 'updated'}: {username} (balance={balance})"
                )
            )
