from django.db import models


class Subscriber(models.Model):
    email        = models.EmailField(unique=True)
    is_active    = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email} ({'active' if self.is_active else 'unsubscribed'})"


class Newsletter(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        SENT  = "sent",  "Sent"

    subject    = models.CharField(max_length=200)
    content    = models.TextField(help_text="Markdown content")
    status     = models.CharField(max_length=10, choices=Status.choices, default=Status.DRAFT)
    sent_at    = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"[{self.status}] {self.subject}"
