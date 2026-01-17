from django.db import models


class AvailableManager(models.Manager):
    """Менеджер для получения только доступных товаров"""
    def get_queryset(self):
        return super().get_queryset().filter(is_available=True)


class Product(models.Model):
    """Модель товара"""

    class Unit(models.TextChoices):
        """Единицы измерения товаров"""
        PIECES = "pieces", "штуки"
        KG = "kg", "килограммы"
        LITER = "liter", "литры"

    name = models.CharField(max_length=255,
                            verbose_name="Наименование")
    price = models.DecimalField(max_digits=10,
                                decimal_places=2,
                                verbose_name="Цена")
    unit = models.CharField(max_length=10,
                            choices=Unit.choices,
                            verbose_name="Единица измерения")
    quantity = models.DecimalField(max_digits=10,
                                   decimal_places=3,
                                   default=0,
                                   verbose_name="Количество на складе")
    description = models.TextField(max_length=2000,
                                   blank=True,
                                   verbose_name="Описание")
    photo = models.ImageField(upload_to=f"photo/products/%Y/%m/%d/",
                              default=None,
                              blank=True,
                              null=True,
                              verbose_name="Фото")
    is_available = models.BooleanField(default=True,
                                       verbose_name="Доступен")

    objects = models.Manager()
    available = AvailableManager()

    class Meta:
        verbose_name = "Товар"
        verbose_name_plural = "Товары"

    def __str__(self):
        return str(self.name)
