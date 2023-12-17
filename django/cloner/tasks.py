import shutil
from hashlib import md5

from celery import shared_task
from celery.utils.log import get_task_logger
from cloner.utils import CloneRepository
from locks.memcached import memcached_lock

from django.conf import settings
from django.db import transaction

logger = get_task_logger(__name__)


@shared_task(bind=True)
def clone_repository_task(self, repository_id, user_id):
    feed_url_hexdigest = md5(str(repository_id).encode()).hexdigest()
    lock_id = f"{self.name}-lock-{feed_url_hexdigest}"
    logger.debug("Cloning repository: %s", str(repository_id).encode())

    with memcached_lock(lock_id, self.app.oid) as acquired:
        if acquired:
            from accounts.utils import get_user
            from cloner.models import Repository

            repository = Repository._default_manager.prefetch_related(
                "users"
            ).get(pk=repository_id)
            user = get_user(user_id)

            CloneRepository(repository, user, trigger=True)
            return None

    logger.debug(
        "Repository #%s is already being cloned by another worker",
        repository_id,
    )


@shared_task(bind=True)
def cleanup_old_data(self):
    from cloner.models import History, Message, Repository

    with transaction.atomic():
        for repo in Repository._default_manager.all():
            # Mandatory to trigger delete signal
            repo.delete()

        for msg in Message._default_manager.all():
            # Mandatory to trigger delete signal
            msg.delete()

        History._default_manager.all().delete()

    shutil.rmtree(settings.MEDIA_ROOT, ignore_errors=True)
