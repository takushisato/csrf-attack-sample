from django.urls import path
from traps import views

urlpatterns = [
    path("", views.index, name="index"),
    path("trap/auto-form/", views.auto_form, name="auto_form"),
    path("trap/image-get/", views.image_get, name="image_get"),
    path("trap/fetch/", views.fetch_attack, name="fetch_attack"),
    path("trap/iframe/", views.iframe_attack, name="iframe_attack"),
]
