from django.urls import path

from .consumers import MessageConsumer, RepositoryConsumer

urlpatterns = [
    path("repositories/", RepositoryConsumer.as_asgi()),
    path("messages/", MessageConsumer.as_asgi()),
]
