from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User


class UserListSerializer(serializers.ModelSerializer):
    """Список пользователей"""
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'phone',
                  'date_of_birth', 'role', 'is_regular', 'total_spent', 'date_joined']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Регистрация пользователя"""
    password = serializers.CharField(style={'input_type': 'password'},
                                     write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True, required=True)
    email = serializers.EmailField(required=True)
    date_of_birth = serializers.DateField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'first_name',
                  'last_name', 'phone', 'date_of_birth', 'role']

    def validate_email(self, value):
        """Проверка уникальности email"""
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Пользователь с таким email уже существует.")
        return value

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Пароли не совпадают!"})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Профиль пользователя"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'phone', 'date_of_birth', 'role', 'is_regular', 'total_spent']
