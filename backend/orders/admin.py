from django.contrib import admin
from .models import Order, OrderItem, DeliveryAssignment


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ["unit_price"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "customer", "status", "total_price", "created_at"]
    list_filter = ["status"]
    inlines = [OrderItemInline]


@admin.register(DeliveryAssignment)
class DeliveryAssignmentAdmin(admin.ModelAdmin):
    list_display = ["order", "delivery_man", "assigned_at"]
