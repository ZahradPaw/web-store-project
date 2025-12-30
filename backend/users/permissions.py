from rest_framework import permissions
from .models import User


STAFF_USERS = (User.Roles.SALESPERSON, User.Roles.MERCHANDISER,
               User.Roles.ADMIN, User.Roles.ACCOUNT_MANAGER, User.Roles.DIRECTOR)


class IsStaffUser(permissions.BasePermission):
    """Права доступа сотрудника"""
    def has_permission(self, request, view):
        return request.user.is_authenticated and (
            request.user.role in STAFF_USERS
        )


class IsOwnerOrStaff(permissions.BasePermission):
    """Клиент получает доступ лишь к своим данным, сотрудники ко всем"""
    def has_object_permission(self, request, view, obj):
        if request.user.role in STAFF_USERS:
            return True
        return obj.client == request.user


class IsStaffOrReadOnly(permissions.BasePermission):
    """Клиенты могут только читать, сотрудники редактировать"""
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user.is_authenticated:
            return False
        return request.user.role in STAFF_USERS


class IsStaffOrReadOnlyDetail(permissions.BasePermission):
    """Сотрудники могут менять данные, остальные только читать"""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user.is_authenticated:
            return False
        return request.user.role in STAFF_USERS


class IsAdminOrStaffReadOnly(permissions.BasePermission):
    """Админ может менять, остальные сотрудники только читать"""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role == User.Roles.ADMIN
