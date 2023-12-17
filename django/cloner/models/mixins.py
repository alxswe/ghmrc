from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.


class TimestampMixin(models.Model):
    class Meta:
        abstract = True

    # timestamps
    added_on = models.DateTimeField(_("added on"), auto_now_add=True)
    modified_on = models.DateTimeField(_("modified on"), auto_now=True)
