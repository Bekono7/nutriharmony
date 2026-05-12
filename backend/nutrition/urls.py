from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CommentViewSet, DishViewSet, HealthProfileDetailView, MealPlanViewSet, OrderViewSet

router = DefaultRouter()
router.register(r"dishes", DishViewSet, basename="dish")
router.register(r"meal-plans", MealPlanViewSet, basename="mealplan")
router.register(r"orders", OrderViewSet, basename="order")


dishes_router = DefaultRouter()
dishes_router.register(r"comments", CommentViewSet, basename="dish-comments")

# Endpoints:
# GET/POST   /api/dishes/
# GET/PUT/PATCH/DELETE /api/dishes/{id}/
# GET/PATCH/DELETE /api/health-profile/
# GET/POST   /api/meal-plans/
# GET/PUT/PATCH/DELETE /api/meal-plans/{id}/
# GET/POST   /api/orders/
# GET/DELETE /api/orders/{id}/

urlpatterns = [
    path("health-profile/", HealthProfileDetailView.as_view(), name="health-profile"),
    path("", include(router.urls)),
    path("dishes/<int:dish_pk>/", include(dishes_router.urls)),
]
