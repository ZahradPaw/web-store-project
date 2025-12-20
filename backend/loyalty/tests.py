from rest_framework import status
from .models import LoyaltySettings
from backend.utils import BaseAPITest


class LoyaltySettingsAPITests(BaseAPITest):
    """Тесты API настроек лояльности"""

    def test_get_loyalty_settings(self):
        """Тест получения настроек лояльности всем"""
        response = self.client.get(self.loyalty_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('regular_threshold', response.data)
        self.assertIn('regular_discount', response.data)
        self.assertIn('delivery_days', response.data)

    def test_update_loyalty_settings_as_admin(self):
        """Тест обновления настроек админом"""
        self.client.force_login(user=self.admin_user)
        data = {
            'regular_threshold': '15000.00',
            'regular_discount': '10.00',
            'delivery_days': '6'
        }
        response = self.client.post(self.loyalty_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['regular_threshold'], '15000.00')
        self.assertEqual(response.data['regular_discount'], '10.00')
        self.assertEqual(str(LoyaltySettings.get_settings().regular_threshold), '15000.00')

    def test_update_loyalty_settings_denied(self):
        """Тест запрета обновления настроек не админом"""
        self.client.force_login(user=self.client_user)
        data = {
            'regular_threshold': '15000.00',
            'regular_discount': '10.00',
            'delivery_days': '6'
        }
        response = self.client.post(self.loyalty_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertNotEqual(LoyaltySettings.get_settings().regular_threshold, '15000.00')

    def test_validate_loyalty_settings_invalid(self):
        """Тест неверного ввода параметров настроек"""
        self.client.force_login(user=self.admin_user)
        data = {
            'regular_threshold': '-100.00',
            'regular_discount': '150.00',
            'delivery_days': '-12'
        }
        response = self.client.post(self.loyalty_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('regular_threshold', response.data)
        self.assertIn('regular_discount', response.data)
        self.assertIn('delivery_days', response.data)

    def test_client_get_regularOn_delivery(self):
        """Тест становления клиента постоянным после достижения пороговой суммы после доставки"""
        self.client.force_login(user=self.client_user2)
        initial_total_spent = self.client_user2.total_spent
        order_data = """
        {
        "items": [
            {"product": 1, "quantity": 10}
        ]
        }
        """
        response = self.client.post(self.orders_url, order_data, content_type='application/json')
        order_id = response.data['id']

        # Клиент ещё не стал постоянным
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.client_user2.refresh_from_db()
        self.assertEqual(self.client_user2.total_spent, initial_total_spent)

        # Меняем статус на "доставлен" (как менеджер по продажам)
        self.client.force_login(user=self.admin_user)
        status_url = f"{self.orders_url}{order_id}/mark_delivered/"
        response = self.client.get(status_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Клиент должен стать постоянным
        self.client_user2.refresh_from_db()
        self.assertFalse(self.client_user2.is_regular)
