from support.models import Support

from django.contrib import admin


# Register your models here.
@admin.register(Support)
class SupportAdmin(admin.ModelAdmin):
    list_display = ["title", "author"]
