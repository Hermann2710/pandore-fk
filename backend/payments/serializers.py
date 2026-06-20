from rest_framework import serializers
from .models import PaymentMethod, Payment
from core.utils import cloudinary_url


class PaymentMethodSerializer(serializers.ModelSerializer):
    logo = serializers.SerializerMethodField()

    class Meta:
        model = PaymentMethod
        fields = ["id", "name", "instructions", "logo", "is_active", "order"]

    def get_logo(self, obj):
        return cloudinary_url(obj.logo)


class PaymentMethodWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ["name", "instructions", "logo", "is_active", "order"]


class PaymentSerializer(serializers.ModelSerializer):
    method = PaymentMethodSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = ["id", "method", "status", "transaction_ref", "created_at", "updated_at"]
