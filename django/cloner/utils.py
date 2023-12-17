import os
import shutil

from cloner import messages
from cloner.models import Message, Repository
from git import Repo

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class CloneRepository:
    """Class responsible for handling the cloning process"""

    def __init__(
        self,
        repository: Repository,
        user: type[models.Model],
        trigger: bool = False,
        testing: bool = False,
    ):
        self.repository = repository
        self.testing = testing

        if self.repository.is_cloned:
            return None

        self.user = user

        if trigger:
            self.trigger()

    def send_message(self, user, type, title, message, **kwargs):
        user.messages.create(
            title=title,
            type=type,
            content=message.format(
                owner=self.repository.owner,
                name=self.repository.name,
                username=self.user.username,
                **kwargs,
            ),
        )

    def _createRoots(self):
        """
        Create the temporary storage of the repositories
        and their archived version
        """

        REPOS_ROOT = os.path.join(settings.MEDIA_ROOT, "repos")
        ZIPS_ROOT = os.path.join(settings.MEDIA_ROOT, "zips")

        os.makedirs(REPOS_ROOT, exist_ok=True)
        os.makedirs(ZIPS_ROOT, exist_ok=True)

    def _archive(self):
        self.repository.archive()

        for subscriber in self.repository.users.exclude(pk=self.user.pk):
            self.send_message(
                user=subscriber,
                type=Repository.INFO,
                title="Clone detected.",
                message=messages.SELECTED_REPO_CLONE_MESSAGE,
            )

    def clone(self, create_roots=False, archive=False):
        """Clone select repository using GitPython

        Args:
            archive (bool, optional): flag indicating if the repository
            should be archived after clone. Defaults to False.
        """
        if create_roots:
            self._createRoots()

        if os.path.exists(self.repository.clone_path):
            shutil.rmtree(self.repository.clone_path, ignore_errors=True)

        if os.path.exists(self.repository.zip_path):
            os.unlink(self.repository.zip_path)

        Repo.clone_from(self.repository.url, self.repository.clone_path)

        if archive:
            self._archive()

    def trigger(self):
        """Trigger the cloninig process"""

        result = None

        data = dict()

        try:
            self.clone(create_roots=True, archive=True)
            self.repository.send_message(action="update")

            data.update(
                {
                    "type": Message.SUCCESS,
                    "title": "Successful clone",
                    "message": messages.SUCCESSFUL_REPO_CLONE_MESSAGE,
                }
            )

            result = True

        except Exception as e:
            print("Traceback: ", str(e))
            data.update(
                {
                    "type": Message.DANGER,
                    "title": "Unsuccessful clone",
                    "message": messages.UNSUCCESSFUL_REPO_CLONE_MESSAGE,
                    "traceback": str(e),
                }
            )

            result = False

        finally:
            self.send_message(user=self.user, **data)

        return result
