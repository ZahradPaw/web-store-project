from django.db import models
from django.contrib.auth.models import AbstractUser
from loyalty.models import LoyaltySettings


class User(AbstractUser):
    """Модель пользователя со своими правами доступа"""

    class Roles(models.TextChoices):
        """Роли пользователей"""
        CLIENT = "client", "Клиент"
        MERCHANDISER = "merchandiser", "Товаровед"
        ACCOUNT_MANAGER = "account_manager", "Клиент-менеджер"
        SALESPERSON = "salesperson", "Продавец"
        DIRECTOR = "director", "Директор"
        ADMIN = "admin", "Администратор"

    role = models.CharField(max_length=50,
                            choices=Roles.choices,
                            default=Roles.CLIENT,
                            verbose_name="Роль")
    date_of_birth = models.DateField(blank=True,
                                     null=True,
                                     verbose_name="Дата рождения")
    phone = models.CharField(max_length=20,
                             verbose_name="Телефон")
    is_regular = models.BooleanField(default=False,
                                     verbose_name="Постоянный клиент")
    total_spent = models.DecimalField(max_digits=10,
                                      decimal_places=2,
                                      default=0,
                                      verbose_name="Общая сумма покупок")

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"

    def __str__(self):
        return f"{self.get_username()}: {self.get_full_name()} - {self.role}"

    def save(self, *args, **kwargs):
        # Если пользователь является суперпользователем, то его роль администратор
        if self.is_superuser:
            self.role = self.Roles.ADMIN
        return super().save(*args, **kwargs)

    def update_regular_status(self):
        """Обновление статуса постоянного клиента"""
        loyalty_settings = LoyaltySettings.get_settings()
        if self.total_spent >= loyalty_settings.regular_threshold and not self.is_regular:
            self.is_regular = True
            self.save()

    def add_to_total_spent(self, amount):
        """Добавление суммы к общей сумме покупок"""
        self.total_spent += amount
        self.save()
        self.update_regular_status()
