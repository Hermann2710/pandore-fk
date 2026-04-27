from rest_framework import serializers
from .models import SiteSettings, SocialLink


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ["id", "platform", "url", "icon", "order", "is_active"]


class SiteSettingsSerializer(serializers.ModelSerializer):
    social_links = SocialLinkSerializer(many=True, read_only=True)
    logo = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = [
            "site_name", "tagline", "description", "logo",
            "email", "phone", "address", "city", "country",
            "shipping_price", "free_shipping_threshold",
            "social_links",
        ]

    def get_logo(self, obj):
        request = self.context.get("request")
        if obj.logo and request:
            return request.build_absolute_uri(obj.logo.url)
        return None


class SiteSettingsWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = [
            "site_name", "tagline", "description", "logo",
            "email", "phone", "address", "city", "country",
            "shipping_price", "free_shipping_threshold",
        ]
