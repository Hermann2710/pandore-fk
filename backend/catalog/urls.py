from django.urls import path
from .views import (
    # Public
    CategoryListView, TagListView,
    ProductListView, ProductDetailView,
    # Admin — categories
    AdminCategoryListCreateView, AdminCategoryDetailView,
    # Admin — tags
    AdminTagListCreateView, AdminTagDetailView,
    # Admin — products
    AdminProductListCreateView, AdminProductDetailView,
)

urlpatterns = [
    # ── Public ────────────────────────────────────────────────────────────────
    path("categories/", CategoryListView.as_view()),
    path("tags/", TagListView.as_view()),
    path("products/", ProductListView.as_view()),
    path("products/<slug:slug>/", ProductDetailView.as_view()),

    # ── Admin — categories ────────────────────────────────────────────────────
    path("admin/categories/", AdminCategoryListCreateView.as_view()),
    path("admin/categories/<int:pk>/", AdminCategoryDetailView.as_view()),

    # ── Admin — tags ──────────────────────────────────────────────────────────
    path("admin/tags/", AdminTagListCreateView.as_view()),
    path("admin/tags/<int:pk>/", AdminTagDetailView.as_view()),

    # ── Admin — products ──────────────────────────────────────────────────────
    path("admin/products/", AdminProductListCreateView.as_view()),
    path("admin/products/<int:pk>/", AdminProductDetailView.as_view()),
]
