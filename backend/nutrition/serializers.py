from decimal import Decimal

from rest_framework import serializers
from .models import Comment, Dish, HealthProfile, MealPlan, MealPlanItem, Order, OrderItem


class HealthProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthProfile
        fields = (
            "id",
            "age",
            "gender",
            "tribe",
            "health_info",
            "allergies",
            "updated_at",
        )
        read_only_fields = ("id", "updated_at")


class DishSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Dish
        fields = (
            "id",
            "name",
            "description",
            "price",
            "category",
            "calories",
            "proteins",
            "carbs",
            "fat",
            "badges",
            "image",
            "image_url",
            "created_by",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_by", "created_at", "updated_at", "image_url")

    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get("request")
        url = obj.image.url
        if request:
            return request.build_absolute_uri(url)
        return url


class MealPlanItemSerializer(serializers.ModelSerializer):
    dish_detail = DishSerializer(source="dish", read_only=True)

    class Meta:
        model = MealPlanItem
        fields = ("id", "dish", "dish_detail", "sort_order")


class MealPlanSerializer(serializers.ModelSerializer):
    items = MealPlanItemSerializer(many=True, required=False)

    class Meta:
        model = MealPlan
        fields = (
            "id",
            "name",
            "plan_date",
            "items",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        meal = MealPlan.objects.create(
            user=self.context["request"].user, **validated_data
        )
        for i, item in enumerate(items_data):
            MealPlanItem.objects.create(
                meal_plan=meal,
                dish=item["dish"],
                sort_order=item.get("sort_order", i),
            )
        return meal

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if items_data is not None:
            instance.items.all().delete()
            for index, item in enumerate(items_data):
                MealPlanItem.objects.create(
                    meal_plan=instance,
                    dish=item["dish"],
                    sort_order=item.get("sort_order", index),
                )
        return instance


class OrderItemSerializer(serializers.ModelSerializer):
    dish_detail = DishSerializer(source="dish", read_only=True)

    class Meta:
        model = OrderItem
        fields = ("id", "dish", "dish_detail", "quantity", "unit_price")
        read_only_fields = ("unit_price",)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    total = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = (
            "id",
            "status",
            "full_name",
            "phone",
            "address",
            "note",
            "items",
            "total",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("status", "total", "created_at", "updated_at")

    def get_total(self, obj: Order) -> str:
        total = Decimal("0")
        for it in obj.items.all():
            total += (it.unit_price or Decimal("0")) * it.quantity
        return str(total)

    def validate_items(self, items):
        if not items or len(items) == 0:
            raise serializers.ValidationError("Le panier est vide.")
        for it in items:
            qty = it.get("quantity", 1)
            try:
                qty_int = int(qty)
            except (TypeError, ValueError):
                raise serializers.ValidationError("Quantité invalide.")
            if qty_int <= 0:
                raise serializers.ValidationError("Quantité invalide.")
        return items

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        order = Order.objects.create(user=self.context["request"].user, **validated_data)

        dish_ids = [it["dish"].id for it in items_data]
        dishes = {d.id: d for d in Dish.objects.filter(id__in=dish_ids)}

        for it in items_data:
            dish = dishes.get(it["dish"].id)
            if not dish:
                raise serializers.ValidationError({"items": "Plat introuvable."})
            OrderItem.objects.create(
                order=order,
                dish=dish,
                quantity=int(it.get("quantity", 1)),
                unit_price=dish.price,
            )

        return order


class CommentSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source="user.email", read_only=True)
    user_name = serializers.CharField(source="user.get_full_name", read_only=True)

    class Meta:
        model = Comment
        fields = (
            "id",
            "dish",
            "user_email",
            "user_name",
            "rating",
            "text",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "user_email", "user_name", "created_at", "updated_at")

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
