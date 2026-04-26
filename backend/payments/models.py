from django.db import models
from django.conf import settings
from orders.models import Order


class PaymentMethod(models.Model):
    name         = models.CharField(max_length=100)
    instructions = models.TextField(blank=True, help_text="Shown to the customer at checkout")
    logo         = models.ImageField(upload_to="payment_methods/", null=True, blank=True)
    is_active    = models.BooleanField(default=True)
    order        = models.PositiveIntegerField(default=0, help_text="Display order")

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING   = "pending",   "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        FAILED    = "failed",    "Failed"

    order          = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment")
    method         = models.ForeignKey(PaymentMethod, on_delete=models.SET_NULL, null=True)
    status         = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    transaction_ref = models.CharField(max_length=100, blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment #{self.pk} — Order #{self.order_id} [{self.status}]"
