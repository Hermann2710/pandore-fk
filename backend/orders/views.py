from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.db import transaction

from .models import Order, OrderItem, DeliveryAssignment
from .serializers import (
    OrderSerializer, CreateOrderSerializer,
    AssignOrderSerializer,
)
from catalog.models import Product
from users.models import User
from core.permissions import IsAdminRole, IsDelivery


# ── Customer ─────────────────────────────────────────────────────────────────

class CustomerOrderListView(APIView):
    """Returns the authenticated customer's own orders."""

    def get(self, request):
        orders = Order.objects.filter(customer=request.user).prefetch_related(
            "items__product", "assignment__delivery_man"
        ).order_by("-created_at")
        return Response(OrderSerializer(orders, many=True, context={"request": request}).data)


class CheckoutView(APIView):
    """
    Converts the frontend cart into a real Order.
    Validates stock, snapshots prices, and decrements inventory atomically.
    """

    @transaction.atomic
    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        order = Order.objects.create(
            customer=request.user,
            shipping_address=data["shipping_address"],
        )
        total = 0
        for item_data in data["items"]:
            product = get_object_or_404(Product, pk=item_data["product_id"])
            qty = item_data["quantity"]
            if product.stock < qty:
                raise Exception(f"Insufficient stock for {product.name}")
            product.stock -= qty
            product.save()
            OrderItem.objects.create(
                order=order, product=product, quantity=qty, unit_price=product.price
            )
            total += product.price * qty

        order.total_price = total
        order.save()
        return Response(OrderSerializer(order, context={"request": request}).data, status=201)


# ── Admin ─────────────────────────────────────────────────────────────────────

class AdminOrderListView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        status_filter = request.query_params.get("status")
        qs = Order.objects.prefetch_related("items__product", "assignment__delivery_man").select_related("customer")
        if status_filter:
            qs = qs.filter(status=status_filter)
        return Response(OrderSerializer(qs.order_by("-created_at"), many=True, context={"request": request}).data)


class AdminAssignOrderView(APIView):
    """
    Admin assigns a pending order to a delivery man.
    Creates a DeliveryAssignment and bumps the order status to 'assigned'.
    """
    permission_classes = [IsAdminRole]

    def post(self, request, order_id):
        order = get_object_or_404(Order, pk=order_id)
        serializer = AssignOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        delivery_man = get_object_or_404(User, pk=serializer.validated_data["delivery_man_id"], role=User.Role.DELIVERY)

        assignment, _ = DeliveryAssignment.objects.update_or_create(
            order=order,
            defaults={
                "delivery_man": delivery_man,
                "notes": serializer.validated_data.get("notes", ""),
            },
        )
        order.status = Order.Status.ASSIGNED
        order.save()
        return Response(OrderSerializer(order, context={"request": request}).data)


# ── Delivery Man ──────────────────────────────────────────────────────────────

class DeliveryQueueView(APIView):
    """Returns all orders assigned to the authenticated delivery man."""
    permission_classes = [IsDelivery]

    def get(self, request):
        assignments = DeliveryAssignment.objects.filter(
            delivery_man=request.user
        ).select_related("order__customer").prefetch_related("order__items__product")
        orders = [a.order for a in assignments]
        return Response(OrderSerializer(orders, many=True, context={"request": request}).data)


class DeliveryUpdateStatusView(APIView):
    """Delivery man advances the status of one of their assigned orders."""
    permission_classes = [IsDelivery]

    ALLOWED_TRANSITIONS = {
        Order.Status.ASSIGNED: Order.Status.PICKED_UP,
        Order.Status.PICKED_UP: Order.Status.IN_TRANSIT,
        Order.Status.IN_TRANSIT: Order.Status.DELIVERED,
    }

    def patch(self, request, order_id):
        assignment = get_object_or_404(DeliveryAssignment, order_id=order_id, delivery_man=request.user)
        order = assignment.order
        next_status = self.ALLOWED_TRANSITIONS.get(order.status)
        if not next_status:
            return Response({"detail": "No further status transition available."}, status=400)
        order.status = next_status
        order.save()
        return Response(OrderSerializer(order, context={"request": request}).data)
