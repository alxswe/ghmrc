from cloner.api import viewsets
from rest_framework.routers import DefaultRouter, SimpleRouter

from django.conf import settings
from django.urls import include, path

# Select router class
router = DefaultRouter() if settings.DEBUG else SimpleRouter()

# Register viewset
router.register("repositories", viewsets.RepositoryViewSet)
router.register("messages", viewsets.MessageViewSet)
router.register("history", viewsets.HistoryViewSet)

urlpatterns = [path("", include(router.urls))]
