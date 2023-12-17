from django.urls import include, path

urlpatterns = [
    path("auth/", include("accounts.api.urls")),
    path("", include("cloner.api.urls")),
    path("", include("support.api.urls")),
    path("cache/", include("cache.api.urls")),
]
