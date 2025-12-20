from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer
from users.permissions import IsStaffOrReadOnly


class ProductViewSet(viewsets.ModelViewSet):
    """Представление списка всех товаров"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IsStaffOrReadOnly,)
