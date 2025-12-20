from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from products.models import Product
from orders.models import Order, OrderItem
from loyalty.models import LoyaltySettings


class BaseAPITest(APITestCase):
    """Базовый класс для теста API"""
    user_model = get_user_model()

    # Пути
    register_url = reverse('users:register')
    profile_url = reverse('users:profile')
    users_list_url = reverse('users:list')
    client_user_detail_url = reverse('users:detail', args=('2',))
    products_url = reverse('products:product-list')
    product_detail_url = reverse('products:product-detail', args=(1,))
    orders_url = reverse('orders:order-list')
    order_detail_url = reverse('orders:order-detail', args=(1,))
    loyalty_url = reverse('loyalty:loyaltysettings-list')

    def setUp(self):
        # Настройки лояльности
        self.loyalty_settings = LoyaltySettings.objects.create(
            regular_threshold=10000,
            regular_discount=5.0,
            delivery_days=3
        )

        # Тестовые пользователи
        self.admin_user = self.user_model.objects.create_superuser(username="root", password="12345")
        self.client_user_data = {
            'username': 'user1',
            'email': 'newuser@test.com',
            'password': 'testpass123',
            'first_name': 'John',
            'last_name': 'Doe',
            'phone': '+79990001133',
            'date_of_birth': '2000-10-05'
        }
        self.client_user = self.user_model.objects.create(**self.client_user_data)
        self.client_user_data2 = {
            'username': 'user2',
            'email': 'newuser2@test.com',
            'password': 'testpass123',
            'first_name': 'Johnny',
            'last_name': 'Deb',
            'phone': '+79994571637',
            'date_of_birth': '2002-12-21'
        }
        self.client_user2 = self.user_model.objects.create(**self.client_user_data2)

        # Тестовые продукты
        self.product_1_data = {
            'name': 'Product 1',
            'price': 100.90,
            'unit': 'pieces',
            'quantity': 10
        }
        self.product_2_data = {
            'name': 'Product 2',
            'price': 50.55,
            'unit': 'kg',
            'quantity': 20.500
        }
        self.product_3_data = {
            'name': 'Product 3',
            'price': 20.30,
            'unit': 'liter',
            'quantity': 30.210
        }
        self.product_1 = Product.objects.create(**self.product_1_data)
        self.product_2 = Product.objects.create(**self.product_2_data)
        self.product_3 = Product.objects.create(**self.product_3_data)

        # Тестовые заказы
        self.order_1 = Order.objects.create(
            client=self.client_user,
            total_price=200
        )
        OrderItem.objects.create(
            order=self.order_1,
            product=self.product_1,
            quantity=2,
            price=100.0,
            total=200.0
        )
        self.order_2 = Order.objects.create(
            client=self.admin_user,
            total_price=200
        )
        OrderItem.objects.create(
            order=self.order_2,
            product=self.product_1,
            quantity=2,
            price=100.0,
            total=200.0
        )
