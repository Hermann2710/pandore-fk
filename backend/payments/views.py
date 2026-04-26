import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from django.shortcuts import get_object_or_404

from .models import PaymentMethod, Payment
from .serializers import PaymentMethodSerializer, PaymentMethodWriteSerializer, PaymentSerializer
from orders.models import Order
from core.permissions import IsAdminRole


# ── Public ────────────────────────────────────────────────────────────────────

class PaymentMethodListView(generics.ListAPIView):
    """Returns all active payment methods for the checkout page."""
    serializer_class = PaymentMethodSerializer

    def get_queryset(self):
        return PaymentMethod.objects.filter(is_active=True)

    def get_serializer_context(self):
        return {"request": self.request}


# ── Customer ──────────────────────────────────────────────────────────────────

class ConfirmPaymentView(APIView):
    """
    Simulates payment confirmation.
    In production this would be a webhook from a real payment gateway.
    Here we just flip the status to confirmed and generate a fake transaction ref.
    """
    def post(self, request, order_id):
        order = get_object_or_404(Order, pk=order_id, customer=request.user)
        payment = get_object_or_404(Payment, order=order)

        if payment.status == Payment.Status.CONFIRMED:
            return Response({"detail": "Payment already confirmed."}, status=400)

        payment.status = Payment.Status.CONFIRMED
        payment.transaction_ref = f"SIM-{uuid.uuid4().hex[:12].upper()}"
        payment.save()

        return Response(PaymentSerializer(payment, context={"request": request}).data)


# ── Admin ─────────────────────────────────────────────────────────────────────

class AdminPaymentMethodListCreateView(generics.ListCreateAPIView):
    queryset = PaymentMethod.objects.all()
    permission_classes = [IsAdminRole]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return PaymentMethodWriteSerializer
        return PaymentMethodSerializer

    def get_serializer_context(self):
        return {"request": self.request}


class AdminPaymentMethodDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PaymentMethod.objects.all()
    permission_classes = [IsAdminRole]

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return PaymentMethodWriteSerializer
        return PaymentMethodSerializer

    def get_serializer_context(self):
        return {"request": self.request}


class AdminPaymentListView(generics.ListAPIView):
    """Admin: see all payments with their status."""
    serializer_class = PaymentSerializer
    permission_classes = [IsAdminRole]

    def get_queryset(self):
        return Payment.objects.select_related("order", "method").order_by("-created_at")

    def get_serializer_context(self):
        return {"request": self.request}
