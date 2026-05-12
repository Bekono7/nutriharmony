from django.db.models import Q
from rest_framework import viewsets
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated

from .models import Comment, Dish, HealthProfile, MealPlan, Order
from .pagination import DishPagination
from .permissions import IsDishEditor
from .serializers import CommentSerializer, DishSerializer, HealthProfileSerializer, MealPlanSerializer, OrderSerializer


class HealthProfileDetailView(RetrieveUpdateDestroyAPIView):
    """
    GET/PATCH/DELETE /api/health-profile/ — ressource unique pour l'utilisateur connecté.
    """

    serializer_class = HealthProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, _ = HealthProfile.objects.get_or_create(user=self.request.user)
        return profile


class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all()
    serializer_class = DishSerializer
    pagination_class = DishPagination

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        if self.action == "create":
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsDishEditor()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        qs = Dish.objects.all()
        cat = self.request.query_params.get("category")
        if cat and cat != "all":
            qs = qs.filter(category=cat)
        q = self.request.query_params.get("search")
        if q:
            qs = qs.filter(Q(name__icontains=q) | Q(description__icontains=q))
        if (
            self.request.query_params.get("mine") == "1"
            and self.request.user.is_authenticated
        ):
            qs = qs.filter(created_by=self.request.user)
        return qs


class MealPlanViewSet(viewsets.ModelViewSet):
    serializer_class = MealPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MealPlan.objects.filter(user=self.request.user).prefetch_related(
            "items__dish"
        )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OrderViewSet(viewsets.ModelViewSet):
    """
    Commandes de l'utilisateur connecté.
    """

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "delete", "head", "options"]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related("items__dish")

    def perform_create(self, serializer):
        serializer.save()

    def perform_destroy(self, instance):
        # Suppression autorisée uniquement tant que la commande est en attente.
        if instance.status != instance.Status.PENDING:
            from rest_framework.exceptions import ValidationError

            raise ValidationError("Impossible de supprimer une commande non 'en attente'.")
        instance.delete()


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(dish_id=self.kwargs["dish_pk"])

    def perform_create(self, serializer):
        serializer.save(dish_id=self.kwargs["dish_pk"], user=self.request.user)
