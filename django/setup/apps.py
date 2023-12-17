from django.apps import AppConfig


class SetupConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "setup"

    def ready(self) -> None:
        try:
            from setup import signals  # noqa
        except ImportError:
            pass

        return super().ready()
