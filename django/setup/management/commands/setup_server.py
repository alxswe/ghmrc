import os

from allauth.socialaccount.models import SocialApp

from django.contrib.auth import get_user_model
from django.contrib.sites.models import Site
from django.core.management.base import BaseCommand
from django.db import transaction


class Command(BaseCommand):
    help = "django command to setup server"

    @transaction.atomic
    def handle(self, *args, **kwargs):
        try:
            site = Site.objects.get_current()
        except Site.DoesNotExist:
            return

        site.domain = os.getenv("SITE_DOMAIN")
        site.name = os.getenv("SITE_NAME")

        site.save(update_fields=["domain", "name"])

        app, _ = SocialApp.objects.get_or_create(
            provider="github",
            name=os.getenv("GITHUB_NAME"),
            client_id=os.getenv("GITHUB_ID"),
            secret=os.getenv("GITHUB_SECRET"),
        )

        app.client_id = os.getenv("GITHUB_ID")
        app.secret = os.getenv("GITHUB_SECRET")

        app.save(update_fields=["client_id", "secret"])

        app.sites.add(site)

        # Create default user is settings.DEBUG

        data = dict(
            username="admin",
            password="admin",
            is_superuser=True,
            is_active=True,
            is_staff=True,
        )
        if not get_user_model().objects.filter(**data).exists():
            get_user_model().objects.create_superuser(**data)
