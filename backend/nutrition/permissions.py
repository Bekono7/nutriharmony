from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsDishEditor(BasePermission):
    """Créateur du plat ou membre staff."""

    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.is_staff:
            return True
        return obj.created_by_id == request.user.id
