from rest_framework import serializers
from .models import Subscriber, Newsletter


class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriber
        fields = ["id", "email", "is_active", "subscribed_at"]


class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = ["id", "subject", "content", "status", "sent_at", "created_at", "updated_at"]
        read_only_fields = ["status", "sent_at", "created_at", "updated_at"]


class NewsletterWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = ["subject", "content"]
