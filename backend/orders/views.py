from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer
from users.permissions import IsStaffOrReadOnlyDetail


class OrderViewSet(viewsets.ModelViewSet):
    """Работа с заказами"""
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = (permissions.IsAuthenticated, IsStaffOrReadOnlyDetail,)

    def get_queryset(self):
        # По-умолчанию заказы получаются в обратном порядке номеров
        user = self.request.user

        # Админы и продавцы видят все заказы
        if user.role in [user.Roles.ADMIN, user.Roles.SALESPERSON]:
            # ID клиента из параметров запроса
            client_id = self.request.query_params.get('client_id')
            # Параметр фильтрации заказов по имени клиента
            client_name = self.request.query_params.get('client_name')

            if client_name:
                return Order.objects.filter(client__first_name=client_name).prefetch_related(
                    'items', 'items__product').order_by('-pk')
            if client_id is None:
                return Order.objects.all().prefetch_related(
                    'items', 'items__product').order_by('-pk')
            return Order.objects.filter(client=client_id).prefetch_related(
                'items', 'items__product').order_by('-pk')

        # Клиенты видят только свои заказы
        return Order.objects.filter(client=user).prefetch_related(
            'items', 'items__product').order_by('-pk')

    def perform_create(self, serializer):
        """Только клиенты и продавцы могут создавать заказы"""
        user = self.request.user

        if user.role == user.Roles.CLIENT:
            # Клиент создает заказы от своего имени
            serializer.save(client=self.request.user)
        elif user.role == user.Roles.SALESPERSON:
            serializer.save()
        else:
            self.permission_denied(self.request, "Только клиенты и продавцы могут создавать заказы")

    @action(detail=True, methods=['get'])
    def mark_cancelled(self, request, pk=None):
        """Отмена заказа"""
        order = self.get_object()

        # Заказ можно отменить, когда он только оформлен
        if order.status != order.Status.CREATED:
            return Response(
                {"detail": "Невозможно отменить заказ в текущем статусе"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Отменяем заказ
        order.status = Order.Status.CANCELLED
        order.save()

        # Возвращаем товары на склад
        for item in order.items.all():
            item.product.quantity += item.quantity
            item.product.save()

        serializer = self.get_serializer(order)
        return Response({
            "message": "Заказ отменен",
            "order": serializer.data
        })

    @action(detail=True, methods=['get'])
    def mark_paid(self, request, pk=None):
        """Отметить заказ как оплаченный"""
        user = request.user

        if user.role not in [user.Roles.SALESPERSON, user.Roles.ADMIN]:
            return Response(
                {"detail": "Недостаточно прав для отметки доставки"},
                status=status.HTTP_403_FORBIDDEN
            )

        order = self.get_object()

        # Изменение статуса на "оплачен"
        order.status = Order.Status.PAID
        order.save()

        # Добавление суммы покупки в статистику клиента
        order.client.add_to_total_spent(order.total_price)

        serializer = self.get_serializer(order)
        return Response({
            "message": "Заказ отмечен как подтвержденный",
            "order": serializer.data
        })

    @action(detail=True, methods=['get'])
    def mark_delivered(self, request, pk=None):
        """Отметить заказ как доставленный"""
        user = request.user

        if user.role not in [user.Roles.SALESPERSON, user.Roles.ADMIN]:
            return Response(
                {"detail": "Недостаточно прав для отметки доставки"},
                status=status.HTTP_403_FORBIDDEN
            )

        order = self.get_object()

        # Заказ можно отметить доставленным, когда он только оплачен
        if order.status != order.Status.PAID:
            return Response(
                {"detail": "Невозможно отметить заказ, как доставленный, пока он не оплачен"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Изменение статуса на "доставлен"
        order.status = Order.Status.DELIVERED
        order.save()

        serializer = self.get_serializer(order)
        return Response({
            "message": "Заказ отмечен как доставленный",
            "order": serializer.data
        })
