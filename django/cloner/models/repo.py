import os
import shutil
from io import BytesIO
from zipfile import ZIP_DEFLATED, ZipFile

from cloner.managers import RepositoryManager
from cloner.models.mixins import TimestampMixin

from django.conf import settings
from django.core import exceptions
from django.core.files.base import ContentFile
from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.


class Repository(TimestampMixin):
    class Meta:
        verbose_name = _("repository")
        verbose_name_plural = _("repositories")
        unique_together = ("name", "owner")

    name = models.CharField(_("name"), max_length=500)
    avatar_url = models.URLField(_("avatar_url"), blank=True, max_length=500)
    owner = models.CharField(_("owner"), max_length=500)

    # Clone related fields
    file = models.FileField(
        _("file"), blank=True, null=True, editable=False, upload_to="zips/"
    )

    users = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        verbose_name=_("users"),
        blank=True,
        editable=False,
        related_name="repositories",
    )

    # managers
    objects = RepositoryManager()

    @property
    def clone_name(self):
        return f"{self.owner}_{self.name}"

    @property
    def clone_path(self):
        return os.path.join(settings.MEDIA_ROOT, "repos", self.clone_name)

    @property
    def zip_path(self):
        return os.path.join(
            settings.MEDIA_ROOT,
            "zips",
            self.clone_name + ".zip",
        )

    @property
    def url(self):
        return f"https://github.com/{self.owner}/{self.name}.git"

    @property
    def is_cloned(self):
        import os

        if self.file.name and os.path.exists(self.file.path):
            return True

        return False

    def send_message(self, action, user=None):
        from cloner.asgi.send import send_user_socket_message
        from cloner.asgi.serializers import RepositoryModelSerializer
        from crum import get_current_request

        serializer = RepositoryModelSerializer(
            self, context={"request": get_current_request()}, read_only=True
        )
        defaults = dict(
            type="send_user_repository",
            table="repositories",
            action=action,
            data=serializer.data,
        )

        if user:
            defaults.update({"pk": user.pk})
            send_user_socket_message(
                name="subscribe_to_user_%s_repositories", **defaults
            )
        else:
            pks = self.users.values_list("id", flat=True)
            for pk in pks:
                defaults.update({"pk": pk})
                send_user_socket_message(
                    name="subscribe_to_user_%s_repositories",
                    **defaults,
                )

    def _handle_cache(self, user):
        from accounts.utils import get_cache

        get_cache(user).clear()

    def add_user(self, user):
        self.users.add(user)
        self.send_message(action="create", user=user)
        self._handle_cache(user)

    def remove_user(self, user):
        self.users.remove(user)
        self.send_message(action="delete", user=user)
        self._handle_cache(user)

    def clone(self, user):
        from cloner.tasks import clone_repository_task

        return clone_repository_task.delay(self.pk, user.id)

    def delete(self, *args, **kwargs):
        super().delete()

    def archive(self):
        import os

        zip_buffer = BytesIO()
        zip_file = ZipFile(zip_buffer, "w", ZIP_DEFLATED, False)

        for foldername, root, filenames in os.walk(self.clone_path):
            for filename in filenames:
                file_path = os.path.join(foldername, filename)
                arcname = os.path.relpath(file_path, self.clone_path)
                zip_file.write(file_path, arcname)

        # Close the ZipFile explicitly before reading from the BytesIO buffer
        zip_file.close()

        # Seek to the beginning of the BytesIO buffer
        zip_buffer.seek(0)

        # Create a ContentFile from the BytesIO buffer
        zip_content = ContentFile(zip_buffer.read())

        # Close the BytesIO buffer
        zip_buffer.close()

        self.file.save(f"{self.clone_name}.zip", zip_content)

    @staticmethod
    def archive_for_user(user):
        _repos = user.repositories.all()
        repos = [repo for repo in _repos if repo.is_cloned]

        if not repos:
            raise exceptions.ValidationError(
                _("Nothing to download at the moment.")
            )

        archive_name = f"{user.username}.zip"

        zip_buffer = BytesIO()
        zip_file = ZipFile(zip_buffer, "w", ZIP_DEFLATED)

        USER_ROOT = settings.MEDIA_ROOT / user.username
        USER_REPOS_ROOT = USER_ROOT / "repos"

        shutil.rmtree(USER_ROOT, ignore_errors=True)
        for repo in repos:
            shutil.copytree(
                repo.clone_path,
                USER_REPOS_ROOT / repo.clone_name,
                dirs_exist_ok=True,
            )

        for foldername, root, filenames in os.walk(USER_REPOS_ROOT):
            for filename in filenames:
                file_path = os.path.join(foldername, filename)
                arcname = os.path.relpath(file_path, USER_REPOS_ROOT)
                zip_file.write(file_path, arcname)

        # Close the ZipFile explicitly before reading from the BytesIO buffer
        zip_file.close()

        # Seek to the beginning of the BytesIO buffer
        zip_buffer.seek(0)

        # Create a ContentFile from the BytesIO buffer
        zip_content = ContentFile(zip_buffer.read())

        # Close the BytesIO buffer
        zip_buffer.close()

        with open(USER_ROOT / archive_name, "wb") as output:
            output.write(zip_content.read())

    def __str__(self):
        return self.name
