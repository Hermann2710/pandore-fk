from django.urls import path
from .views import (
    CategoryListView, TagListView,
    ProductListView, ProductDetailView,
    AdminProductCreateView, AdminProductUpdateView,
)

urlpatterns = [
    path("categories/", CategoryListView.as_view()),
    path("tags/", TagListView.as_view()),
    path("products/", ProductListView.as_view()),
    path("products/<slug:slug>/", ProductDetailView.as_view()),
    path("admin/products/", AdminProductCreateView.as_view()),
    path("admin/products/<slug:slug>/", AdminProductUpdateView.as_view()),
]
