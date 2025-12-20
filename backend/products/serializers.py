from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = '__all__'

    def validate(self, attrs):
        unit = attrs.get('unit')
        quantity = attrs.get('quantity')
        price = attrs.get('price')

        if quantity is not None and quantity < 0:
            raise serializers.ValidationError({
                'quantity': 'Количество не может быть отрицательным'
            })

        if price is not None and price <= 0:
            raise serializers.ValidationError({
                'price': 'Цена должна быть положительной'
            })

        if (quantity is not None and unit is not None and
                unit == Product.Unit.PIECES and quantity % 1 != 0):
            raise serializers.ValidationError({
                'quantity': 'Для товаров в штуках количество должно быть целым числом'
            })

        return super().validate(attrs)
