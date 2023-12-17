import os
import shutil

from cloner.models import Repository
from cloner.utils import CloneRepository

from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import FileResponse
from django.test import TestCase


class DownloadRepositoryTest(TestCase):
    def setUp(self) -> None:
        # Create repository
        self.owner = "alxswe"
        self.name = "test-clone"

        self.repo = Repository(name=self.name, owner=self.owner)
        self.repo.save()

        # Create a default user
        self.user = get_user_model().objects.create(username="test")
        self.user.refresh_from_db()

        # Add user to subscribes
        self.repo.add_user(user=self.user)

    def test_clone_and_download(self):
        CloneRepository(repository=self.repo, user=self.user, trigger=True)

        self.assertTrue(
            expr=self.repo.is_cloned,
            msg="repo.is_cloned must return True, got: False",
        )

        self.repo.archive_for_user(user=self.user)

        response = FileResponse(
            open(
                self.user.file_path,
                "rb",
            ),
            as_attachment=True,
        )

        response[
            "Content-Disposition"
        ] = f'attachment; filename="{os.path.basename(self.user.file_path)}"'  # noqa

        self.assertIsInstance(response, FileResponse)

    def tearDown(self) -> None:
        shutil.rmtree(
            settings.STATIC_ROOT,
            ignore_errors=True,
        )
