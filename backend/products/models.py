from django.db import models


class Product(models.Model):
    """Модель товара"""

    class Unit(models.TextChoices):
        """Единицы измерения товаров"""
        PIECES = "pieces", "штуки"
        KG = "kg", "килограммы"
        LITER = "liter", "литры"

    name = models.CharField(max_length=255, verbose_name="Наименование товара")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена")
    unit = models.CharField(max_length=10, choices=Unit.choices, verbose_name="Единица измерения")
    quantity = models.DecimalField(max_digits=10, decimal_places=3, default=0, verbose_name="Количество на складе")

    objects = models.Manager()

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"

    def __str__(self):
        return str(self.name)
