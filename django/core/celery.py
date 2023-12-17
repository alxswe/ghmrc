import os

from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

from django.conf import settings  # noqa

if settings.DEBUG:
    log_level = "DEBUG"
else:
    log_level = "INFO"


app = Celery("tasks")

app.conf.update(
    broker_connection_retry_on_startup=True,
    broker_url=os.getenv("BROKER_URL"),
    result_backend=os.getenv("RESULT_BACKEND"),
    result_expires=3600,  # Set to 1 hour (in seconds)
    default_retry_delay=30,  # Set to 30 seconds
    max_retries=3,  # Maximum number of retries
    retry_backoff=2,  # Exponential backoff factor
    task_time_limit=600,
    task_track_started=True,
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    worker_concurrency=2,
    worker_prefetch_multiplier=2,
    worker_log_format="%(asctime)s - %(levelname)s - %(message)s",
    worker_log_color=False,  # Disable colorized output for log lines
    worker_log_level=log_level,
)

app.conf.beat_schedule = {
    "cleanup_repositories": {
        "task": "cloner.tasks.cleanup_old_data",
        # Run task everyday at 1:00 AM (Daylight saving might effect this)
        "schedule": crontab(hour=1, minute=0),
        "args": [],
        "kwargs": {},
    }
}

# Load task modules from all registered Django apps.
app.autodiscover_tasks()
