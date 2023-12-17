from cloner.models import History, Message, Repository

from django.contrib import admin

# Register your models here.


@admin.register(Repository)
class RepositoryAdmin(admin.ModelAdmin):
    list_display = ["name", "owner", "is_cloned", "added_on", "modified_on"]
    search_fields = ["name", "owner"]
    readonly_fields = ("file", "users")


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ["title", "type", "added_on"]
    list_filter = ["type"]
    search_fields = ["title"]


@admin.register(History)
class HistoryAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "owner",
        "user",
        "added_on",
        "modified_on",
    ]
    search_fields = ["owner", "name"]
