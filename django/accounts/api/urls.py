from django.urls import path

from . import views

urlpatterns = [
    path(
        "login/github/",
        views.GitHubLogin.as_view(),
        name="github_login",
    )
]
