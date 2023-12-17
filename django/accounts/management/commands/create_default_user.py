from typing import Any

from django.contrib.auth import get_user_model
from django.core.management.base import (
    BaseCommand,
    CommandError,
    CommandParser,
)

User = get_user_model()


class Command(BaseCommand):
    help = "django command to create default user"

    def add_arguments(self, parser: CommandParser) -> None:
        parser.add_argument(
            "--username",
            default="admin",
            type=str,
            help="username of the user.",
        )
        parser.add_argument(
            "--password",
            type=str,
            help="password of the user. If none provided",
        )
        parser.add_argument(
            "-a", "--admin", action="store_true", default=False
        )
        return super().add_arguments(parser)

    def handle(self, *args: Any, **options: Any) -> str | None:
        username = options.get("username")
        password = options.get("password")
        is_admin = options.get("admin")

        try:
            user, _ = User._default_manager.get_or_create(
                is_active=True, username=username
            )
            if _:
                user.set_password(password if password else username)
                if is_admin:
                    user.is_superuser = True
                    user.is_staff = True

                user.save()

        except Exception as e:
            raise CommandError(str(e))
