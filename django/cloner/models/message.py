from cloner.models.mixins import TimestampMixin

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.


class Message(TimestampMixin):
    class Meta:
        verbose_name = _("message")
        verbose_name_plural = _("messages")

    INFO, WARNING, DANGER, SUCCESS = "Info", "Warning", "Danger", "Success"

    TYPES = (
        (INFO, _(INFO)),
        (WARNING, _(WARNING)),
        (DANGER, _(DANGER)),
        (SUCCESS, _(SUCCESS)),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=_("user"),
        on_delete=models.CASCADE,
        related_name="messages",
    )
    type = models.CharField(_("type"), choices=TYPES, default=INFO, max_length=50)
    title = models.CharField(_("title"), max_length=500)
    content = models.TextField(_("content"))

    def __str__(self):
        return self.title
