from django.db import models


class LoyaltySettings(models.Model):
    """Модель для хранения настроек системы лояльности, а также время доставки по-умолчанию"""
    regular_threshold = models.DecimalField(
        max_digits=10, decimal_places=2,
        default=0.00, verbose_name="Порог для постоянного клиента"
    )
    regular_discount = models.DecimalField(
        max_digits=5, decimal_places=2,
        default=0.00, verbose_name="Скидка на все товары (%)"
    )
    delivery_days = models.PositiveIntegerField(
        default=3, verbose_name="Срок доставки (дней)",
        help_text="Стандартное количество дней на доставку"
    )

    class Meta:
        verbose_name = "Настройка лояльности"
        verbose_name_plural = "Настройки лояльности"

    def save(self, *args, **kwargs):
        # Удаление предыдущей настройки при создании новой
        if not self.pk and LoyaltySettings.objects.exists():
            LoyaltySettings.objects.first().delete()
        return super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        """Получение текущих настроек (создает по умолчанию если нет)"""
        if cls.objects.exists():
            return cls.objects.first()
        return cls.objects.create()
