from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "unit", "quantity", "is_available")
    list_display_links = ("name",)
    ordering = ("name",)
    list_per_page = 10
    search_fields = ("name",)
    fields = ("name", "photo", "price", "unit", "quantity", "description", "is_available")
