from django.contrib import admin
from .models import Order, OrderItem


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "client", "order_date", "delivery_date", "total_price", "status")
    list_display_links = ("id",)
    ordering = ("id",)
    list_per_page = 10
    search_fields = ("client",)
    fields = ("client", "delivery_date", "total_price", "status")


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("order", "product", "quantity", "total")
    list_display_links = ("order",)
    ordering = ("order",)
    list_per_page = 10
    search_fields = ("order",)
    fields = ("order", "product", "quantity", "price", "total")
