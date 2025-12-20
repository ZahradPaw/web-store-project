from django.urls import path
from . import views


app_name = "users"

urlpatterns = [
    path('register/', views.UserRegistrationView.as_view(), name="register"),
    path('list/', views.UserListView.as_view(), name="list"),
    path('profile/', views.UserProfileView.as_view(), name="profile"),
    path('user/<int:pk>/', views.UserDetailView.as_view(), name="detail"),
]
