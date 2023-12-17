from typing import Any

from django.db import models
from django.db.utils import IntegrityError


class RepositoryManager(models.Manager):
    def clone_all(self, user, *args: Any, **kwargs: Any):
        repos = super().filter(*args, **kwargs)
        for repo in repos:
            repo.clone(user=user)

    def create(self, user=None, **kwargs: Any) -> Any:
        try:
            obj = super().create(**kwargs)
        except IntegrityError:
            unique_together = {}
            for field in self.model._meta.unique_together:
                if isinstance(field, str):
                    unique_together[field] = kwargs.get(field)
                else:
                    # in case of a tuple or list
                    for _field in field:
                        unique_together[_field] = kwargs.get(_field)

            obj = self.model.objects.get(**unique_together)

        if user:
            obj.add_user(user=user)

        return obj
