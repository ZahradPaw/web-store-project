from django.urls import path, include
from rest_framework import routers
from . import views


app_name = "loyalty"

router = routers.DefaultRouter()
router.register('', views.LoyaltySettingsViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
