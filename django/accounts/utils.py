from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.exceptions import ObjectDoesNotExist

User = get_user_model()


def get_user(pk):
    try:
        return User._default_manager.get(pk=pk)
    except ObjectDoesNotExist:
        return None


def get_cache_name(user):
    return f"api-cache-{user.pk}"


class UserCache:
    API_CACHE_NAME = "api-cache-%s"

    def __init__(self, user):
        self.cache_name = self.API_CACHE_NAME % user.username

    def get(self):
        return cache.get(self.cache_name)

    def set(self, data, timeout=None):
        if timeout is None:
            timeout = getattr(settings, "API_CACHE_TIMEOUT", 60)

        cache.set(self.cache_name, data, timeout=timeout)

    def handle(self, data=None):
        current = self.get()
        if current:
            return current

        self.set(data)
        return data

    def clear(self):
        self.set(data=None)


def get_cache(user):
    return UserCache(user=user)
