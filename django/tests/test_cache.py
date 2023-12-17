from django.core.cache import caches
from django.test import TestCase


class CachesSetupTest(TestCase):
    def test_redis_cache_setup(self):
        # Check if the 'redis' cache is properly set up
        redis_cache = caches["redis"]
        self.assertIsNotNone(redis_cache)

        # Perform a simple operation to test the cache
        key = "test_key"
        value = "test_value"
        redis_cache.set(key, value)
        cached_value = redis_cache.get(key)
        self.assertEqual(cached_value, value)

    def test_memcached_cache_setup(self):
        # Check if the 'memcached' cache is properly set up
        memcached_cache = caches["memcached"]
        self.assertIsNotNone(memcached_cache)

        # Perform a simple operation to test the cache
        key = "test_key"
        value = "test_value"
        memcached_cache.set(key, value)
        cached_value = memcached_cache.get(key)
        self.assertEqual(cached_value, value)
