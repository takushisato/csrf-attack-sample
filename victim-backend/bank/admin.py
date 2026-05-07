from django.contrib import admin
from .models import Account, TransferLog

admin.site.register(Account)
admin.site.register(TransferLog)
