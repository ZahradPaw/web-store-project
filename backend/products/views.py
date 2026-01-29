from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer
from users.permissions import IsStaffOrReadOnly, STAFF_USERS


class ProductViewSet(viewsets.ModelViewSet):
    """Представление списка всех товаров"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IsStaffOrReadOnly,)

    def get_queryset(self):
        # Получение товаров, содержащих указанные символы через параметр name
        name = self.request.query_params.get('name', '')

        return Product.objects.filter(name__icontains=name)


class ProductsAvailableListView(generics.ListAPIView):
    """Представление списка доступных товаров"""
    queryset = Product.available.all()
    serializer_class = ProductSerializer
    permission_classes = (IsStaffOrReadOnly,)

    def get_queryset(self):
        # Получение товаров, содержащих указанные символы через параметр name
        name = self.request.query_params.get('name', '')

        return Product.available.filter(name__icontains=name)
