from rest_framework import status
from backend.utils import BaseAPITest


class RegisterAPITests(BaseAPITest):
    """Тесты API регистрации"""

    def test_admin_user_role(self):
        """Тест роли администратора для суперпользователей"""
        self.assertEqual(self.admin_user.role, self.user_model.Roles.ADMIN)

    def test_client_user_role(self):
        """Тест роли клиента для обычных пользователей"""
        self.assertEqual(self.client_user.role, self.user_model.Roles.CLIENT)

    def test_user_registration_success(self):
        """Тест успешной регистрации нового пользователя-клиента"""
        data = {
            'username': 'user3',
            'email': 'newuser3@test.com',
            'password': 'testpass123',
            'password2': 'testpass123',
            'first_name': 'Johnny',
            'last_name': 'Doe',
            'phone': '+79990001133',
            'date_of_birth': '2000-10-05'
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], data['username'])
        # Проверка роли клиента
        self.assertTrue(self.user_model.objects.filter(username=response.data['username']).exists())
        self.assertEqual(self.user_model.objects.get(username=response.data['username']).role, self.user_model.Roles.CLIENT)

    def test_user_registration_password_mismatch(self):
        """Тест регистрации с несовпадающими паролями"""
        data = {
            'username': 'user3',
            'email': 'newuser3@test.com',
            'password': 'testpass123',
            'password2': 'testpass12345',
            'first_name': 'Johnny',
            'last_name': 'Doe',
            'phone': '+79990001133',
            'date_of_birth': '2000-10-05'
        }
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)
        self.assertFalse(self.user_model.objects.filter(username=data['username']).exists())

    def test_user_registration_existing_login_and_email(self):
        """Тест регистрации с существующими логином и email"""
        response = self.client.post(self.register_url, self.client_user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
        self.assertIn('email', response.data)
        self.assertFalse(self.user_model.objects.filter(username=response.data['username']).exists())

    def test_user_registration_without_required_fields(self):
        """Попытка регистрации без обязательных полей"""
        response = self.client.post(self.register_url, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)
        self.assertIn('email', response.data)
        self.assertIn('phone', response.data)
        self.assertIn('date_of_birth', response.data)
        self.assertFalse(self.user_model.objects.filter(username=response.data['username']).exists())


class UsersAPITests(BaseAPITest):
    """Тесты API пользователей"""

    def test_get_users_list_as_admin(self):
        """Тест получения списка пользователей, как админ"""
        self.client.force_login(user=self.admin_user)
        response = self.client.get(self.users_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 3)

    def test_get_users_list_denied(self):
        """Тест запрета получения списка пользователей клиентам и неавторизованным"""
        response = self.client.get(self.users_list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('detail', response.data)
        # Попытка получения доступа клиентом
        self.client.force_login(user=self.client_user)
        response = self.client.get(self.users_list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('detail', response.data)

    def test_get_user_details_as_admin(self):
        """Тест получения доступа к пользователю админом"""
        self.client.force_login(user=self.admin_user)
        response = self.client.get(self.client_user_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('username', response.data)

    def test_change_user_details_as_admin(self):
        """Тест изменения данных пользователя админом"""
        new_user_data = {
            'username': 'user1',
            'first_name': 'Johnny',
            'role': 'admin',
            'date_of_birth': '2000-12-05'
        }
        self.client.force_login(user=self.admin_user)
        response = self.client.put(self.client_user_detail_url, new_user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('username', response.data)
        self.assertEqual(self.user_model.objects.get(
            username=response.data['username']).role, self.user_model.Roles.ADMIN)

    def test_get_user_details_denied(self):
        """Тест запрета получения доступа к другому пользователю клиентам"""
        response = self.client.get(self.client_user_detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('detail', response.data)
        # Попытка получения доступа клиентом
        self.client.force_login(user=self.client_user)
        response = self.client.get(self.client_user_detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('detail', response.data)

    def test_get_profile(self):
        """Тест получения данных своего профиля"""
        self.client.force_login(user=self.client_user)
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('username', response.data)
        self.assertEqual(self.client_user_data['username'], response.data['username'])

    def test_failed_get_profile(self):
        """Тест отклонения получения данных профиля для неавторизованных"""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('detail', response.data)
