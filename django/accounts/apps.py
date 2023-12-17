from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"

    def ready(self) -> None:
        try:
            from accounts import signals  # noqa
        except ImportError:
            pass
        return super().ready()
