from rest_framework import status
from .models import Order
from backend.utils import BaseAPITest


class OrdersAPITests(BaseAPITest):
    """Тесты API заказов"""

    def test_create_order_as_client(self):
        """Тест создания нового заказа клиентом"""
        self.client.force_login(user=self.client_user)
        order_data = """
        {
        "items": [
            {"product": 1, "quantity": 2},
            {"product": 2, "quantity": 3.5},
            {"product": 3, "quantity": 5.12}
        ]
        }
        """
        order_price = round(self.product_1.price * 2 +
                            self.product_2.price * 3.5 +
                            self.product_3.price * 5.12, 2)
        response = self.client.post(self.orders_url, order_data, content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['client'], self.client_user.pk)
        self.assertEqual(response.data['total_price'], str(order_price))
        self.assertTrue(Order.objects.filter(client=response.data['client']).exists())

    def test_create_empty_order_failed(self):
        """Тест запрета создания пустого заказа"""
        self.client.force_login(user=self.client_user)
        order_data = {'items': []}
        response = self.client.post(self.orders_url, order_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('items', response.data)

    def test_create_order_insufficient_quantity_failed(self):
        """Тест запрета заказа товаров больше, чем есть в наличии"""
        self.client.force_login(user=self.client_user)
        order_data = """
        {
        "items": [
            {"product": 1, "quantity": 20}
        ]
        }
        """
        response = self.client.post(self.orders_url, order_data, content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_own_orders_as_client(self):
        """Тест того, что клиент может просматривать лишь свои заказы"""
        self.client.force_login(user=self.client_user)
        response = self.client.get(self.orders_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_get_all_orders_as_admin(self):
        """Тест получения администратором всех заказов"""
        self.client.force_login(user=self.admin_user)
        response = self.client.get(self.orders_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)

    def test_update_order_delivery_date_as_admin(self):
        """Тест изменения даты и статуса доставки заказа администратором"""
        self.client.force_login(user=self.admin_user)
        data = {'delivery_date': '2025-12-31', 'status': 'confirmed'}
        response = self.client.patch(self.order_detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['delivery_date'], data['delivery_date'])
        self.assertEqual(response.data['status'], data['status'])

    def test_client_cannot_update_order(self):
        """Тест запрета клиентам на изменение заказов"""
        self.client.force_login(user=self.client_user)
        data = {'delivery_date': '2024-12-31', 'status': 'confirmed'}
        response = self.client.patch(self.order_detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('detail', response.data)

    def test_regular_client_discount_applied(self):
        """Тест применения скидки для постоянного клиента"""
        self.client_user.is_regular = True
        self.client_user.save()
        self.client.force_login(user=self.client_user)
        order_data = """
        {
        "items": [
            {"product": 1, "quantity": 2}
        ]
        }
        """
        order_price = self.product_1.price * 2
        discount_amount = order_price * float(self.loyalty_settings.get_settings().regular_discount / 100)
        order_price -= discount_amount
        response = self.client.post(self.orders_url, order_data, content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(float(response.data['total_price']), order_price)
