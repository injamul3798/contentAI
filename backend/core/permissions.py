from rest_framework import permissions

class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission: only owners or admins can edit/delete
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions: only for authenticated owner or admin
        user = request.user
        if not user or not user.is_authenticated:
            return False

        return obj.owner == user or user.role == 'admin'
