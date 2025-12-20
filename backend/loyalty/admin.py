from django.contrib import admin
from .models import LoyaltySettings


@admin.register(LoyaltySettings)
class LoyaltySettingsAdmin(admin.ModelAdmin):
    list_display = ("id", "regular_threshold", "regular_discount")
    fields = ("regular_threshold", "regular_discount")
