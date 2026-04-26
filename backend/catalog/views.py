from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Category, Tag, Product
from .serializers import (
    CategorySerializer, TagSerializer,
    ProductSerializer, ProductWriteSerializer,
)


class IsAdminRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin_role


# ── Public ────────────────────────────────────────────────────────────────────

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class TagListView(generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.AllowAny]


class ProductListView(generics.ListAPIView):
    """
    Public catalog — multi-axis filtering:
    ?category=<slug>&tags=<slug>,<slug>&min_price=X&max_price=Y&search=<term>
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description", "tags__name", "category__name"]
    ordering_fields = ["price", "created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        qs = (
            Product.objects.filter(is_active=True)
            .select_related("category")
            .prefetch_related("tags", "attributes")
        )
        category = self.request.query_params.get("category")
        tags = self.request.query_params.get("tags")
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")
        if category:
            qs = qs.filter(category__slug=category)
        if tags:
            for tag_slug in tags.split(","):
                qs = qs.filter(tags__slug=tag_slug.strip())
        if min_price:
            qs = qs.filter(price__gte=min_price)
        if max_price:
            qs = qs.filter(price__lte=max_price)
        return qs.distinct()


class ProductDetailView(generics.RetrieveAPIView):
    queryset = (
        Product.objects.filter(is_active=True)
        .select_related("category")
        .prefetch_related("tags", "attributes")
    )
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"


# ── Admin — Categories ────────────────────────────────────────────────────────

class AdminCategoryListCreateView(generics.ListCreateAPIView):
    """List all categories or create a new one."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminRole]


class AdminCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminRole]


# ── Admin — Tags ──────────────────────────────────────────────────────────────

class AdminTagListCreateView(generics.ListCreateAPIView):
    """List all tags or create a new one."""
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAdminRole]


class AdminTagDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAdminRole]


# ── Admin — Products ──────────────────────────────────────────────────────────

class AdminProductListCreateView(generics.ListCreateAPIView):
    """
    Admin sees ALL products (including inactive ones).
    Public catalog only shows is_active=True.
    """
    permission_classes = [IsAdminRole]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "category__name"]
    ordering_fields = ["price", "created_at", "stock"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return (
            Product.objects.all()
            .select_related("category")
            .prefetch_related("tags", "attributes")
        )

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ProductWriteSerializer
        return ProductSerializer


class AdminProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all().select_related("category").prefetch_related("tags", "attributes")
    permission_classes = [IsAdminRole]

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return ProductWriteSerializer
        return ProductSerializer
