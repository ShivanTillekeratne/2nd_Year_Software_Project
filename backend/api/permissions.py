from rest_framework import permissions
from .models import CustomUser

class IsRoleAdmin(permissions.BasePermission):
    """
    Custom permission to only allow users with the 'Admin' role to access certain views.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == CustomUser.Role.ADMIN.value
