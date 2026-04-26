from rest_framework import serializers
from .models import Category, Tag, AttributeKey, Product, ProductAttribute


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
