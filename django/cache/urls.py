from django.urls import path

from .consumer import CacheConsumer

urlpatterns = [path("cache/", CacheConsumer.as_asgi())]
