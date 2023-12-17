from cloner.models.mixins import TimestampMixin

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.translation import ngettext_lazy

# Create your models here.


class History(TimestampMixin):
    class Meta:
        verbose_name = _("history")
        verbose_name_plural = _("histories")

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=_("user"),
        on_delete=models.CASCADE,
        related_name="history",
    )
    name = models.CharField(_("name"), max_length=500)
    owner = models.CharField(_("owner"), max_length=500)
    url = models.URLField(_("url"))

    @classmethod
    def clean_user_history(cls, user_id):
        from cloner.models.message import Message

        deleted, _ = cls._default_manager.filter(user_id=user_id).delete()
        message = ngettext_lazy(
            "Deleted: %(count)sx history",
            "Deleted: %(count)sx histories",
            deleted,
        )
        Message._default_manager.create(
            title="History cleared.",
            type=Message.SUCCESS,
            content=message,
            user_id=user_id,
        )
