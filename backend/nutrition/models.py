from django.conf import settings
from django.db import models


class HealthProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="health_profile",
    )
    age = models.PositiveSmallIntegerField(null=True, blank=True)
    gender = models.CharField(max_length=32, blank=True)
    tribe = models.CharField(max_length=120, blank=True)
    health_info = models.TextField(blank=True)
    allergies = models.TextField(blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return f"Profil santé — {self.user.email}"


class Dish(models.Model):
    class Category(models.TextChoices):
        ENTREES = "entrees", "Entrées"
        PLATS = "plats", "Plats"
        DESSERTS = "desserts", "Desserts"
        BOISSONS = "boissons", "Boissons"

    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    category = models.CharField(
        max_length=20, choices=Category.choices, default=Category.PLATS
    )
    calories = models.PositiveIntegerField(null=True, blank=True)
    proteins = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    carbs = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    fat = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    badges = models.JSONField(default=list, blank=True)
    image = models.ImageField(upload_to="dishes/", blank=True, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="dishes_created",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class MealPlan(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="meal_plans",
    )
    name = models.CharField(max_length=200)
    plan_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-plan_date", "-created_at"]

    def __str__(self):
        return f"{self.name} ({self.plan_date})"


class MealPlanItem(models.Model):
    meal_plan = models.ForeignKey(
        MealPlan, on_delete=models.CASCADE, related_name="items"
    )
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name="meal_items")
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "En attente"
        PAID = "paid", "Payée"
        CANCELLED = "cancelled", "Annulée"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders"
    )
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING
    )
    full_name = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    address = models.TextField(blank=True)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Commande #{self.id} — {self.user.email}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    dish = models.ForeignKey(Dish, on_delete=models.PROTECT, related_name="order_items")
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ["id"]


class Comment(models.Model):
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="comments"
    )
    rating = models.PositiveSmallIntegerField(
        choices=[(i, i) for i in range(1, 6)],
        default=5
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = ["dish", "user"]

    def __str__(self):
        return f"Commentaire de {self.user.email} sur {self.dish.name}"
