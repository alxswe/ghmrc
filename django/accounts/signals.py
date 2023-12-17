from django.apps import apps
from django.core.management import call_command
from django.db.models.signals import post_migrate
from django.dispatch import receiver


@receiver(post_migrate)
def call_server_command(*args, **kwargs):
    if apps.is_installed("setup"):
        call_command("setup_server")
