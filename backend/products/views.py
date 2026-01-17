from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer
from users.permissions import IsStaffOrReadOnly, STAFF_USERS


class ProductViewSet(viewsets.ModelViewSet):
    """Представление списка всех товаров"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IsStaffOrReadOnly,)

    def get_queryset(self):
        user = self.request.user

        # Получение товаров, содержащих указанные символы через параметр name
        name = self.request.query_params.get('name', '')

        # Сотрудники могут получать все товары, обычные пользователи только доступные
        if hasattr(user, 'role') and user.role in STAFF_USERS:
            return Product.objects.filter(name__icontains=name)
        return Product.available.filter(name__icontains=name)
