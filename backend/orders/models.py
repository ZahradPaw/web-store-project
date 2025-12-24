from django.db import models
from django.conf import settings


class Order(models.Model):
    """Модель заказа"""

    class Status(models.TextChoices):
        """Статус заказа"""
        CREATED = "created", "Оформлен"
        PAID = "paid", "Оплачен"
        DELIVERED = "delivered", "Доставлен"
        CANCELLED = "cancelled", "Отменен"

    client = models.ForeignKey(settings.AUTH_USER_MODEL,
                               on_delete=models.CASCADE,
                               related_name="orders",
                               verbose_name="Клиент")
    order_date = models.DateTimeField(auto_now_add=True, verbose_name='Дата заказа')
    delivery_date = models.DateField(null=True, blank=True, verbose_name='Дата доставки')
    total_price = models.DecimalField(max_digits=12,
                                      decimal_places=2,
                                      default=0,
                                      verbose_name="Итоговая стоимость")
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.CREATED,
        verbose_name="Статус заказа")

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"

    def __str__(self):
        return f"Заказ {self.pk} от {self.client.username}"


class OrderItem(models.Model):
    """Модель товара в заказе"""
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE,
                              verbose_name="Заказ")
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE,
                                verbose_name="Товар")
    quantity = models.DecimalField(max_digits=10, decimal_places=2,
                                   verbose_name="Количество")
    price = models.DecimalField(max_digits=10, decimal_places=2,
                                verbose_name="Цена за единицу")
    total = models.DecimalField(max_digits=12, decimal_places=2,
                                verbose_name="Общая цена")

    class Meta:
        verbose_name = 'Элемент заказа'
        verbose_name_plural = 'Элементы заказа'

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
