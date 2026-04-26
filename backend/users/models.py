from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Extended user model. The 'role' field drives the entire permission
    logic — one model, three distinct experiences.
    """

    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        DELIVERY = "delivery", "Delivery Man"
        CUSTOMER = "customer", "Customer"

    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CUSTOMER)
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)

    @property
    def is_admin_role(self):
        return self.role == self.Role.ADMIN

    @property
    def is_delivery(self):
        return self.role == self.Role.DELIVERY

    def __str__(self):
        return f"{self.username} ({self.role})"


class ShippingAddress(models.Model):
    """
    A saved delivery address belonging to a user.
    One address can be marked as default — the checkout pre-fills it.
    """
    user        = models.ForeignKey(User, on_delete=models.CASCADE, related_name="shipping_addresses")
    label       = models.CharField(max_length=100, default="Home", help_text="e.g. Home, Office")
    full_name   = models.CharField(max_length=200)
    line1       = models.CharField(max_length=255)
    line2       = models.CharField(max_length=255, blank=True)
    city        = models.CharField(max_length=100)
    state       = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20)
    country     = models.CharField(max_length=100, default="Cameroon")
    phone       = models.CharField(max_length=20, blank=True)
    is_default  = models.BooleanField(default=False)

    class Meta:
        ordering = ["-is_default", "id"]

    def save(self, *args, **kwargs):
        # Ensure only one default address per user
        if self.is_default:
            ShippingAddress.objects.filter(user=self.user, is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.label} — {self.full_name}, {self.city}"

    def as_string(self):
        """Returns a single-line address string for use in orders."""
        parts = [self.full_name, self.line1]
        if self.line2:
            parts.append(self.line2)
        parts += [self.city]
        if self.state:
            parts.append(self.state)
        parts += [self.postal_code, self.country]
        return ", ".join(parts)
