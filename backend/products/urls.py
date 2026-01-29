from django.urls import path, include
from rest_framework import routers
from . import views


app_name = "products"

router = routers.DefaultRouter()
router.register('', views.ProductViewSet)

urlpatterns = [
    path('available/', views.ProductsAvailableListView.as_view(), name="available"),
    path('', include(router.urls)),
]
