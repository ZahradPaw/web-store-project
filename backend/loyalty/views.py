from rest_framework import viewsets, status, generics, views
from rest_framework.response import Response
from .models import LoyaltySettings
from .serializers import LoyaltySettingsSerializer
from users.permissions import IsStaffOrReadOnly


class LoyaltySettingsViewSet(viewsets.ModelViewSet):
    """Представления для получения и изменения настроек лояльности"""
    queryset = LoyaltySettings.objects.all()
    serializer_class = LoyaltySettingsSerializer
    permission_classes = (IsStaffOrReadOnly,)

    def list(self, request, *args, **kwargs):
        # Показываем только текущие активные настройки
        settings = LoyaltySettings.get_settings()
        serializer = self.get_serializer(settings)
        return Response(serializer.data)
