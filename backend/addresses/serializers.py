from rest_framework import serializers
from users.models import ShippingAddress


class ShippingAddressSerializer(serializers.ModelSerializer):
    formatted = serializers.SerializerMethodField()

    class Meta:
        model = ShippingAddress
        fields = [
            "id", "label", "full_name", "line1", "line2",
            "city", "state", "postal_code", "country",
            "phone", "is_default", "formatted",
        ]

    def get_formatted(self, obj):
        return obj.as_string()
