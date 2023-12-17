from django.urls import path

from . import views

urlpatterns = [path("", views.CacheAPIView.as_view(), name="cache-detail")]
