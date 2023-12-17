import os
from pathlib import Path

from django.utils.crypto import get_random_string

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


SECRET_KEY = get_random_string(length=28)

ALLOWED_HOSTS = ["*"]

DEFAULT_AUTO_FIELD = "django.db.models.AutoField"

# Application definition

INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    # "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    # Rest Framework
    "rest_framework",
    "rest_framework.authtoken",
    # Dj Rest Auth
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    # "allauth.socialaccount.providers.github",
    # Local Apps
    # "setup",
    "accounts",
    "cloner",
    "support",
]

SITE_ID = 1

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.contrib.auth.context_processors.auth",
                "django.template.context_processors.request",
                "django.contrib.messages.context_processors.messages",
            ]
        },
    },
]

# [Database]
database_engine = os.environ.get("DATABASE_ENGINE", "sqlite")
database_config = {
    "sqlite": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    },
    "postgres": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "postgres",
        "USER": "postgres",
        "PASSWORD": "postgres",
        "HOST": "",
        "PORT": "",
    },
}

github_workflow = os.environ.get("GITHUB_WORKFLOW")
if github_workflow:
    database_config["postgres"]["NAME"] = "postgres"
    database_config["postgres"]["HOST"] = "127.0.0.1"
    database_config["postgres"]["PORT"] = "5432"

DATABASES = {
    "default": database_config.get(database_engine),
}

# [Cache]
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": "",
    },
    "redis": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": "",
    },
    "memcached": {
        "BACKEND": "django.core.cache.backends.memcached.PyMemcacheCache",
        "LOCATION": "",
    },
}
if github_workflow:
    CACHES["default"]["LOCATION"] = "redis://127.0.0.1:6379/0"
    CACHES["redis"]["LOCATION"] = "redis://127.0.0.1:6379/0"
    CACHES["memcached"]["LOCATION"] = "127.0.0.1:11211"


# [Static]
STATIC_ROOT = BASE_DIR / "static/testing/static"
STATIC_URL = "/static/"

# [Media]
MEDIA_ROOT = BASE_DIR / "static/testing/static/media/"
MEDIA_URL = "/media/"


AUTH_USER_MODEL = "accounts.usermodel"
