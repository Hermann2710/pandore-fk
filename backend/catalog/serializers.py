from rest_framework import serializers
from .models import Category, Tag, AttributeKey, Product, ProductAttribute, HomepageSection


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description"]


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "slug"]


class ProductAttributeSerializer(serializers.ModelSerializer):
    key = serializers.StringRelatedField()

    class Meta:
        model = ProductAttribute
        fields = ["key", "value"]


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    attributes = ProductAttributeSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "description", "price",
            "stock", "image", "category", "tags", "attributes",
            "is_active", "created_at",
        ]

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class ProductWriteSerializer(serializers.ModelSerializer):
    """Used by admin for create/update — accepts IDs instead of nested objects."""
    class Meta:
        model = Product
        fields = ["name", "slug", "description", "price", "stock", "image", "category", "tags", "is_active"]


class HomepageSectionSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    category = CategorySerializer(read_only=True)
    bg_image = serializers.SerializerMethodField()

    class Meta:
        model = HomepageSection
        fields = [
            "id", "title", "subtitle", "type", "order", "is_active",
            "products", "category", "cta_label", "cta_url",
            "bg_color", "bg_image",
        ]

    def get_bg_image(self, obj):
        request = self.context.get("request")
        if obj.bg_image and request:
            return request.build_absolute_uri(obj.bg_image.url)
        return None


class HomepageSectionWriteSerializer(serializers.ModelSerializer):
    """Admin write — accepts product IDs and category ID."""
    class Meta:
        model = HomepageSection
        fields = [
            "title", "subtitle", "type", "order", "is_active",
            "products", "category", "cta_label", "cta_url",
            "bg_color", "bg_image",
        ]
