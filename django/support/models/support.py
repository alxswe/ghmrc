from cloner.models.mixins import TimestampMixin

from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class Support(TimestampMixin):
    class Meta:
        verbose_name = _("suppor")
        verbose_name_plural = _("support")

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name=_("author"),
        on_delete=models.SET_NULL,
        null=True,
        related_name="support",
    )
    title = models.CharField(_("title"), max_length=250)
    content = models.TextField(_("content"))

    def __str__(self):
        return self.title
