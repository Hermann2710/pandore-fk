from rest_framework import serializers
from .models import User, ShippingAddress


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "phone", "avatar", "is_active", "date_joined"]


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Self-service profile update — users can only touch their own safe fields."""
    class Meta:
        model = User
        fields = ["username", "email", "phone", "avatar"]

    def validate_username(self, value):
        qs = User.objects.filter(username=value).exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        qs = User.objects.filter(email=value).exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("This email is already in use.")
        return value


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField()
    new_password     = serializers.CharField(min_length=8)


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


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["username", "email", "password", "role", "phone"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class WishlistSerializer(serializers.ModelSerializer):
    from catalog.serializers import ProductSerializer
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        from .models import Wishlist
        model = Wishlist
        fields = ["id", "products", "updated_at"]
