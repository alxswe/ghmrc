from django.apps import AppConfig


class ClonerConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "cloner"

    def ready(self) -> None:
        try:
            from cloner import signals  # noqa
        except ImportError:
            pass
        return super().ready()
