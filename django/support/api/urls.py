from rest_framework.routers import DefaultRouter, SimpleRouter
from support.api import views

from django.conf import settings
from django.urls import include, path

router = DefaultRouter() if settings.DEBUG else SimpleRouter()


urlpatterns = [
    path("", include(router.urls)),
    path("support/", views.CreateSupportView.as_view(), name="create-support"),
]
