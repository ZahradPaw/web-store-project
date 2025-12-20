from rest_framework import serializers
from .models import LoyaltySettings


class LoyaltySettingsSerializer(serializers.ModelSerializer):

    class Meta:
        model = LoyaltySettings
        fields = ['regular_threshold', 'regular_discount', 'delivery_days']

    def validate_regular_threshold(self, value):
        if value <= 0:
            raise serializers.ValidationError("Порог должен быть положительным числом")
        return value

    def validate_regular_discount(self, value):
        if value <= 0 or value >= 100:
            raise serializers.ValidationError("Скидка должна быть от 0 до 100%")
        return value

    def validate_delivery_days(self, value):
        if value < 0 or value > 30:
            raise serializers.ValidationError("Срок доставки должен быть от 0 до 30 дней")
        return value
