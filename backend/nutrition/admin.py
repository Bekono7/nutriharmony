from django.contrib import admin

from .models import Dish, HealthProfile, MealPlan, MealPlanItem


@admin.register(HealthProfile)
class HealthProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "age", "gender", "tribe", "updated_at")
    search_fields = ("user__email", "tribe")


@admin.register(Dish)
class DishAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "calories", "created_by", "created_at")
    list_filter = ("category",)
    search_fields = ("name", "description")


class MealPlanItemInline(admin.TabularInline):
    model = MealPlanItem
    extra = 0


@admin.register(MealPlan)
class MealPlanAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "plan_date", "created_at")
    list_filter = ("plan_date",)
    inlines = [MealPlanItemInline]
