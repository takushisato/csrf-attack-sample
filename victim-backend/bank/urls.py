from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.login_view),
    path("logout/", views.logout_view),
    path("me/", views.me_view),
    path("transfer/", views.transfer_view),
    path("transfers/", views.transfer_history_view),
]
