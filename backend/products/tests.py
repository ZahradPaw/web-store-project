from rest_framework import status
from .models import Product
from backend.utils import BaseAPITest


class ProductsAPITests(BaseAPITest):
    """Тесты API товаров"""

    def test_get_products_list(self):
        """Тест получения списка всех товаров"""
        response = self.client.get(self.products_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 3)

    def test_add_new_product_as_admin(self):
        """Тест добавления нового товара администратором"""
        data = {
            'name': 'Product 4',
            'price': 150.30,
            'unit': 'pieces',
            'quantity': 5
        }
        self.client.force_login(user=self.admin_user)
        response = self.client.post(self.products_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], data['name'])
        self.assertTrue(Product.objects.filter(name=response.data['name']).exists())

    def test_add_new_product_denied(self):
        """Тест запрета на добавление новых товаров клиентам и неавторизованным"""
        data = {
            'name': 'Product 4',
            'price': 150.30,
            'unit': 'pieces',
            'quantity': 5
        }
        self.client.force_login(user=self.client_user)
        response = self.client.post(self.products_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(Product.objects.filter(name=data['name']).exists())

    def test_get_product_details(self):
        """Тест получения данных о товаре"""
        response = self.client.get(self.product_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.product_1_data['name'])

    def test_change_product_details_as_admin(self):
        """Тест изменения данных о товаре администратором"""
        data = {
            'name': 'Product 1',
            'price': 120.20,
            'unit': 'pieces',
            'quantity': 20
        }
        self.client.force_login(user=self.admin_user)
        response = self.client.put(self.product_detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('name', response.data)
        self.assertEqual(Product.objects.get(name=response.data['name']).quantity, data['quantity'])

    def test_change_product_details_denied(self):
        """Тест запрета на изменение данных о товаре клиентам и неавторизованным"""
        data = {
            'name': 'Product 1',
            'price': 120.20,
            'unit': 'pieces',
            'quantity': 20
        }
        self.client.force_login(user=self.client_user)
        response = self.client.put(self.product_detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('detail', response.data)
        self.assertNotEqual(Product.objects.get(name=data['name']).quantity, data['quantity'])
