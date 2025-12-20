from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "unit", "quantity")
    list_display_links = ("name",)
    ordering = ("name",)
    list_per_page = 10
    search_fields = ("name",)
    fields = ("name", "price", "unit", "quantity")
