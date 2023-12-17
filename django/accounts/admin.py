from accounts.models import UserModel

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as AuthUserAdmin


# Register your models here.
@admin.register(UserModel)
class UserAdmin(AuthUserAdmin):
    pass
