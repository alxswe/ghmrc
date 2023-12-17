from django.apps import AppConfig


class SupportConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "support"

    def ready(self) -> None:
        try:
            from support import signals
        except ImportError:
            pass
        return super().ready()
