from django.contrib.auth import get_user_model
from rest_framework import generics, permissions
from .models import User
from .serializers import UserListSerializer, UserProfileSerializer, UserRegistrationSerializer
from .permissions import IsStaffUser


class UserListView(generics.ListAPIView):
    """Представление списка всех пользователей"""
    queryset = User.objects.all()
    serializer_class = UserListSerializer
    permission_classes = (IsStaffUser,)

    def get_queryset(self):
        # Получение пользователей, содержащих указанные символы через параметр name
        name = self.request.query_params.get('name', '')
        # Получение пользователей по роли через параметр role
        role = self.request.query_params.get('role')

        if role:
            return User.objects.filter(first_name__icontains=name, role=role)
        return User.objects.filter(first_name__icontains=name)


class UserProfileView(generics.RetrieveAPIView):
    """Профиль пользователя"""
    serializer_class = UserProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        # Получение своих данных для личного кабинета
        return self.request.user


class UserRegistrationView(generics.CreateAPIView):
    """Регистрация пользователя"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = (permissions.AllowAny,)

    def perform_create(self, serializer):
        """Только администратор может указывать роль пользователя, остальные по-умолчанию клиенты"""
        user = self.request.user

        if hasattr(user, 'role') and user.role == get_user_model().Roles.ADMIN:
            serializer.save()
        else:
            serializer.save(role=get_user_model().Roles.CLIENT)


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Управление пользователем"""
    queryset = User.objects.all()
    serializer_class = UserListSerializer
    permission_classes = (IsStaffUser,)
