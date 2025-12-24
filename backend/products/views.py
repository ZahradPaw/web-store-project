from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer
from users.permissions import IsStaffOrReadOnly


class ProductViewSet(viewsets.ModelViewSet):
    """Представление списка всех товаров"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (IsStaffOrReadOnly,)

    def get_queryset(self):
        # Получение товаров, содержащих указанные символы через параметр name
        name = self.request.query_params.get('name')

        if name:
            return Product.objects.filter(name__icontains=name)
        return Product.objects.all()
