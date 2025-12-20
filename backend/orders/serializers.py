from rest_framework import serializers
from datetime import timedelta
from django.utils import timezone
from .models import Order, OrderItem
from loyalty.models import LoyaltySettings


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_unit = serializers.CharField(source='product.unit', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_unit', 'quantity', 'price', 'total']
        read_only_fields = ['id', 'price', 'total']


class OrderSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='client.get_full_name', read_only=True)
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ['id', 'client', 'client_name', 'order_date', 'delivery_date',
                  'total_price', 'items', 'status']
        read_only_fields = ['id', 'order_date', 'total_price']

    def validate_items(self, value):
        """Валидация элементов заказа (только при создании)"""
        if not value:
            raise serializers.ValidationError("Заказ должен содержать хотя бы один товар")

        for item in value:
            if item['quantity'] <= 0:
                raise serializers.ValidationError("Количество товара должно быть положительным")

        return value

    def validate(self, data):
        # При создании проверяем наличие товаров
        if self.instance is None:
            if 'items' not in data or not data['items']:
                raise serializers.ValidationError({
                    "items": "Заказ должен содержать хотя бы один товар"
                })
        return data

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        request = self.context.get('request')
        client = validated_data.get('client')

        # Если в запросе нет клиента, то устанавливается пользователь, вызвавший запрос
        if client is None:
            client = request.user

        # Автоматический расчет даты доставки
        delivery_date = self.calculate_auto_delivery_date()
        validated_data.pop('delivery_date', None)

        # Создание заказа
        order = Order.objects.create(
            delivery_date=delivery_date,
            **validated_data)

        total_price = 0

        # Заполнение элементов заказа
        for item_data in items_data:
            product = item_data['product']
            quantity = item_data['quantity']

            # Проверка, что товара хватает для заказа
            if product.quantity < quantity:
                raise serializers.ValidationError(f"Недостаточное количество товара '{product.name}'. "
                                                  f"Доступно: {product.quantity}")

            # Расчет общей цены
            price = product.price
            total = quantity * price

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=price,
                total=total
            )

            total_price += total

            # Уменьшаем кол-во товаров
            product.quantity -= quantity
            product.save()

        # Применение скидки для постоянных клиентов
        if client.is_regular:
            settings = LoyaltySettings.get_settings()
            discount_amount = total_price * (settings.regular_discount / 100)
            total_price -= discount_amount

        # Обновление общей стоимости
        order.total_price = total_price
        order.save()

        return order

    def update(self, instance, validated_data):
        # Можно менять лишь дату доставки, для статуса отдельные представления
        if 'delivery_date' in validated_data:
            instance.delivery_date = validated_data['delivery_date']
        instance.save()
        return instance

    @staticmethod
    def calculate_auto_delivery_date():
        """Автоматический расчет даты доставки"""
        settings = LoyaltySettings.get_settings()
        base_days = settings.delivery_days

        delivery_date = timezone.now().date() + timedelta(days=base_days)

        # Пропускаем выходные (суббота или воскресенье)
        while delivery_date.weekday() >= 5:
            delivery_date += timedelta(days=1)

        return delivery_date
