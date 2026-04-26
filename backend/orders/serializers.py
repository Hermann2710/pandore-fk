from rest_framework import serializers
from .models import Order, OrderItem, DeliveryAssignment
from catalog.serializers import ProductSerializer
from users.serializers import UserSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_id", "quantity", "unit_price", "subtotal"]

    def get_subtotal(self, obj):
        return obj.get_subtotal()


class DeliveryAssignmentSerializer(serializers.ModelSerializer):
    delivery_man = UserSerializer(read_only=True)

    class Meta:
        model = DeliveryAssignment
        fields = ["id", "delivery_man", "assigned_at", "notes"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    assignment = DeliveryAssignmentSerializer(read_only=True)
    customer = UserSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "customer", "status", "shipping_address",
            "total_price", "items", "assignment", "created_at", "updated_at",
        ]


class CreateOrderSerializer(serializers.Serializer):
    """Validates the checkout payload from the frontend cart."""
    shipping_address = serializers.CharField()
    items = serializers.ListField(
        child=serializers.DictField(child=serializers.IntegerField()),
        min_length=1,
    )


class AssignOrderSerializer(serializers.Serializer):
    delivery_man_id = serializers.IntegerField()
    notes = serializers.CharField(required=False, allow_blank=True)
