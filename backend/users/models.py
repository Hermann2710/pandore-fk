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
