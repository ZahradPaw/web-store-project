from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "first_name", "last_name", "email", "role")
    list_display_links = ("username",)
    ordering = ("date_joined", "username")
    list_per_page = 5
    search_fields = ("username",)
    fields = ("username",
              "first_name",
              "last_name",
              "email",
              "role",
              "phone",
              "is_regular",
              "date_of_birth",
              "total_spent")
