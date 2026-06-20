from rest_framework import serializers
from .models import User
from core.utils import cloudinary_url


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "phone", "avatar", "is_active", "date_joined"]

    def get_avatar(self, obj):
        return cloudinary_url(obj.avatar)


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "phone", "avatar"]

    def validate_username(self, value):
        if User.objects.filter(username=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField()
    new_password     = serializers.CharField(min_length=8)
